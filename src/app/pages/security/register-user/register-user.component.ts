import { Component, OnInit, ElementRef } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { NbDialogService } from "@nebular/theme";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { CurrentUserService } from "src/app/services/current-user.service";
import { Util } from "src/app/utils/util";
import { HelperService } from "src/app/services/helper.service";
import { RegisterUserModalComponent } from "./register-user-modal/register-user-modal.component";
import { RegisterServiceTypeModalComponent } from "../../service-type/register-service-type-modal/register-service-type-modal.component";
import { AppDecisionAlertComponent } from "src/app/components/app-decision-alert/app-decision-alert.component";
import { RegisterGroupModalComponent } from "../register-group/register-group-modal/register-group-modal.component";
import { AppChangePasswordComponent } from "./app-change-password/app-change-password.component";

@Component({
  selector: "app-register-user",
  templateUrl: "./register-user.component.html",
  styleUrls: ["./register-user.component.scss"],
  providers: [UserService]
})
export class RegisterUserComponent implements OnInit {
  data = [];
  update = [];
  take = 10;
  offset = 0;
  filtro: any;
  enabled = false;
  totalRecords = 0;
  popoverIsVisible: boolean;
  elementosComClickInserido = [];
  columns = [
    { field: "nome", name: "Nome" },
    { field: "login", name: "Login" },
    { field: "email", name: "Email" },
    { field: "tipoUsuario", name: "Grupo" },
    { field: "deletado", type: "ativarUser", name: "Ações" }
  ];
  componentsList = [
    {
      name: "RegisterUserModalComponent",
      component: RegisterUserModalComponent
    },
    {
      name: "AppChangePasswordComponent",
      component: AppChangePasswordComponent
    }
  ];
  code = "";

  constructor(
    private elementRef: ElementRef,

    private userService: UserService,
    private nbDialogService: NbDialogService,
    private helperService: HelperService,

    private nbToastrService: NbToastrService,
    public uService: CurrentUserService,
    private util: Util
  ) {
    this.popoverIsVisible = false;
  }

  showPopover() {
    this.popoverIsVisible = true;
  }

  changePage(selectedPage: number) {
    this.filtro.take = 10;
    this.filtro.offset = (selectedPage - 1) * 10;
    this.fetch(this.filtro);
    this.filtro.take = 10;
    this.filtro.offset = 0;
  }

  hidePopover() {
    this.popoverIsVisible = false;
  }

  ngOnInit() {
    const permissions = this.uService.getEnumPermissions();
    this.columns = this.util.controlActionsTable(
      this.columns,
      permissions.AtualizarUsuario,
      permissions.InativarAtivarUsuario,
      permissions.ConsultarUsuario
    );
    this.filtro = {};
    this.filtro.take = 10;
    this.filtro.offset = 0;
    this.fetch(this.filtro);
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let count = 0;
      for (const item of this.data) {
        const element = allElements[count];
        if (
          !this.uService.validatePermissions(
            this.uService.getEnumPermissions().AtualizarUsuario
          )
        )
          element.style.visibility = "hidden";

        let template = "";
        let id = "";
        if (element.getAttribute("eventName") == "Editar") {
          template = "RegisterUserModalComponent";
        } else {
          template = element.getAttribute("template") || "";
        }
        id = item.id;

        if (!this.elementosComClickInserido.includes(element)) {
          element.addEventListener(
            "click",
            () => {
              template != ""
                ? this.detail(template, id)
                : this.inativarRegistro(id);
            },
            false
          );
          this.elementosComClickInserido.push(element);
        }
        count += 1;
      }
      // }
    }, 1000);
    this.addEventInativar();
  }

  addEventInativar() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "ui-switch"
      );
      let count = 0;
      for (const item of this.data) {
        // for (const element of allElements) {
        const element = allElements[count];
        if (
          !this.uService.validatePermissions(
            this.uService.getEnumPermissions().InativarAtivarUsuario
          )
        )
          element.style.visibility = "hidden";

        if (!this.elementosComClickInserido.includes(element)) {
          element.addEventListener(
            "click",
            () => {
              this.inativarRegistro(item.id);
            },
            false
          );
          this.elementosComClickInserido.push(element);
        }
        count += 1;
      }
    }, 1000);
  }

  detail(template: any, code: string) {
    const currentTemplate = this.componentsList.find(
      ({ name }) => name === template
    );
    let permissao = this.uService.validatePermissions(
      this.uService.getEnumPermissions().AtualizarUsuario
    );
    if (permissao) {
      const item = this.data.find(({ id }) => id === code);
      const ref = this.nbDialogService.open<any>(currentTemplate.component, {
        context: {
          data: item
        }
      });
      this.helperService.isModalToClose.asObservable().subscribe(res => {
        if (res) ref.close();
        this.ngOnInit();
      });
    } else {
      this.nbToastrService.danger(
        "Usuário não autorizado a atualizar dados dos usuários.",
        "Falha",
        {
          duration: 2000
        }
      );
    }
  }

  fetch(code: any) {
    this.userService.fetchUser(code).subscribe(({ value }) => {
      this.totalRecords = value.qtd;
      this.data = value.data.map(item => {
        return {
          ...item,
          tipoUsuario: item.grupo.nome,
          grupo: item.grupo
        };
      });
      this.data.sort((a, b) => {
        return a.nome.localeCompare(b.nome);
      });
      this.addEvent();
    });
  }

  itemChanged(result: any, code: string) {
    this.inativarRegistro(code);
  }

  inativarRegistro(code: string) {
    let idDeletado = code;
    let mensagem = "Registro desativado com sucesso.";
    this.userService.deleteUser(code).subscribe(
      res => {
        this.data.forEach(element => {
          if (element.id == idDeletado) {
            element.deletado = element.deletado ? false : true;
            if (!element.deletado) mensagem = "Registro ativado com sucesso.";
          }
        });
        this.nbToastrService.success(mensagem, "Sucesso", {
          duration: 2000
        });
        this.ngOnInit();
      },
      () => {
        this.nbToastrService.danger("Falha ao remover o registro", "Falha", {
          duration: 2000
        });
        this.ngOnInit();
      }
    );
  }

  newValue() {
    this.nbDialogService
      .open(RegisterUserModalComponent, {
        context: { code: this.code }
      })
      .onClose.subscribe(code => {
        this.ngOnInit();
      });
  }

  eventrender(event, element) {
    event.element[0]
      .querySelectorAll(".tooltip")[0]
      .setAttribute("data-tooltip", event.event.title);
  }
}
