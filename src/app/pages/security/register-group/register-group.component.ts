import { Component, OnInit, ElementRef } from "@angular/core";
import { GroupService } from "src/app/services/group.service";
import { NbDialogService } from "@nebular/theme";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { RegisterGroupModalComponent } from "./register-group-modal/register-group-modal.component";
import { CurrentUserService } from "src/app/services/current-user.service";
import { Util } from "src/app/utils/util";
import { HelperService } from "src/app/services/helper.service";

import { RegisterUserModalComponent } from "../register-user/register-user-modal/register-user-modal.component";

@Component({
  selector: "app-register-group",
  templateUrl: "./register-group.component.html",
  styleUrls: ["./register-group.component.scss"],
  providers: [GroupService]
})
export class RegisterGroupComponent implements OnInit {
  data = [];
  totalRecords = 0;
  filtro: any;

  elementosComClickInserido = [];
  columns = [
    { field: "nome", name: "Nome" },
    { field: "descricao", name: "Descrição" },
    { field: "dataRegistro", name: "Data de criação", type: "date" },
    { field: "situacao", type: "ativarEditar", name: "Ações" }
  ];
  componentsList = [
    {
      name: "RegisterGroupModalComponent",
      component: RegisterGroupModalComponent
    }
  ];
  code = "";

  constructor(
    private elementRef: ElementRef,

    private groupService: GroupService,
    private nbDialogService: NbDialogService,
    private nbToastrService: NbToastrService,
    public uService: CurrentUserService,
    private helperService: HelperService,

    private util: Util
  ) {}

  ngOnInit() {
    const permissions = this.uService.getEnumPermissions();
    this.columns = this.util.controlActionsTable(
      this.columns,
      permissions.AtualizarGrupo,
      permissions.InativarAtivarGrupo
    );
    this.filtro = {};
    this.filtro.take = 10;
    this.filtro.offset = 0;
    this.fetchGroups(this.filtro);
    this.addEvent();
  }

  itemChanged(result: any, code: string) {
    this.inativarRegistro(code);
  }

  changePage(selectedPage: number) {
    this.filtro.take = 10;
    this.filtro.offset = (selectedPage - 1) * 10;
    this.fetchGroups(this.filtro);
    this.filtro.take = 10;
    this.filtro.offset = 0;
  }

  inativarRegistro(code: string) {
    let idDeletado = code;
    let mensagem = "Registro desativado com sucesso.";
    this.groupService.delete(code).subscribe(
      res => {
        this.data.forEach(element => {
          if (element.id == idDeletado) {
            element.situacao = element.situacao ? false : true;
            if (element.situacao) mensagem = "Registro ativado com sucesso.";
          }
        });
        this.nbToastrService.success(mensagem, "Sucesso", {
          duration: 2000
        });
        this.ngOnInit();
      },
      () => {
        this.nbToastrService.danger(
          "Falha ao ativar/desativar o registro",
          "Falha",
          {
            duration: 2000
          }
        );
      }
    );
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let count = 0;
      for (const item of this.data) {
        const element = allElements[count];
        let template = "RegisterGroupModalComponent";
        let id = "";
        if (element.getAttribute("eventName") == "Editar") {
          template = "RegisterGroupModalComponent";
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
      this.uService.getEnumPermissions().AtualizarGrupo
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
        "Usuário não autorizado a atualizar dados do grupo.",
        "Falha",
        {
          duration: 2000
        }
      );
    }
  }

  fetchGroups(filtro) {
    this.groupService.fetchGrupos(filtro).subscribe(({ value }) => {
      this.totalRecords = value.qtd;
      this.data = value.data.map(item => {
        return {
          ...item,
          nome: item.nome,
          descricao: item.descricao,
          actions: `
            <a class="detail-button
            ${
              !this.uService.validatePermissions(
                this.uService.getEnumPermissions().AtualizarGrupo
              )
                ? "remove"
                : ""
            }"
            action="detail" template="RegisterGroupModalComponent" code="${
              item.id
            }" >Editar</a>

            <a class="detail-button
            ${
              !this.uService.validatePermissions(
                this.uService.getEnumPermissions().InativarAtivarGrupo
              )
                ? "remove"
                : ""
            }"
            action="delete" template="AppDecisionAlertComponent" eventName=${
              item.situacao == false ? "AtivarGrupo" : "DeletarGrupo"
            }  code="${item.id}" > ${
            item.situacao == 0 ? "Ativar" : "Inativar"
          }</a>
            `
        };
      });
      this.data.forEach(element => {
        if (element.nome == "Administrador") element.situacao = null;
      });

      this.data.sort((a, b) =>
        a.nome > b.nome ? 1 : a.nome === b.nome ? 0 : -1
      );
    });
  }

  newValue() {
    this.nbDialogService
      .open(RegisterGroupModalComponent, {
        context: { code: this.code }
      })
      .onClose.subscribe(code => {
        this.ngOnInit();
      });
  }
}
