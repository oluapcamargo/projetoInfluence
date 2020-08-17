import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { GroupService } from "src/app/services/group.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { HelperService } from "src/app/services/helper.service";
import { UserNet } from "src/app/models/userNet";
import { Validators, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-register-user-modal",
  templateUrl: "./register-user-modal.component.html",
  styleUrls: ["./register-user-modal.component.scss"]
})
export class RegisterUserModalComponent implements OnInit {
  code: string;
  data: UserNet = new UserNet();
  userTypes: any = [];
  permissionsAdded = [];
  validName: boolean = false;
  validEmail: boolean = true;
  dataForm = FormGroup;
  grupoCodigo: any;
  constructor(
    private userService: UserService,
    private grupoService: GroupService,
    private elementRef: ElementRef,

    private nbToastrService: NbToastrService,
    private helperService: HelperService,
    private nbDialogRef: NbDialogRef<RegisterUserModalComponent>
  ) {}

  ngOnInit() {
    this.userType();
  }

  validacaoNome() {
    if (this.data.nome != null && this.data.nome != "") this.validName = false;
    else this.validName = true;
  }
  validacaoEmail() {
    {
      if (this.data.email === undefined || this.data.email.length == 0)
        this.validEmail = false;
      else {
        var usuario = this.data.email.substring(
          0,
          this.data.email.indexOf("@")
        );
        var dominio = this.data.email.substring(
          this.data.email.indexOf("@") + 1,
          this.data.email.length
        );

        if (
          usuario.length >= 1 &&
          dominio.length >= 3 &&
          usuario.search("@") == -1 &&
          dominio.search("@") == -1 &&
          usuario.search(" ") == -1 &&
          dominio.search(" ") == -1 &&
          dominio.search(".") != -1 &&
          dominio.indexOf(".") >= 1 &&
          dominio.lastIndexOf(".") < dominio.length - 1
        ) {
          this.validEmail = true;
        } else {
          this.validEmail = false;
        }
      }
    }
  }
  userType() {
    this.grupoService.fetch().subscribe(({ value }) => {
      this.userTypes = value.data;

      if (
        this.data != undefined &&
        this.data.id != undefined &&
        this.userTypes != undefined &&
        this.userTypes.length > 0
      ) {
        this.grupoCodigo = this.data.grupo.nome;
      }
    });
  }

  fetchGroups(code) {
    this.data.tipoUsuario = code;
  }
 
  save() {
    this.userTypes.forEach(element => {
      if (element.nome == this.data.tipoUsuario) {
        this.data.grupo = element;
      }
    });
    this.data.tipoUsuario = "1";
    if (
      this.validEmail &&
      this.data.email != undefined &&
      this.data.nome != undefined
    ) {
      if (this.data.id) {
        this.userService.updateUser(this.data, this.data.id).subscribe(
          res => {
            if (res.hasSuccess) {
              this.nbToastrService.success(
                "Registro salvo com sucesso",
                "Sucesso",
                {
                  duration: 2000
                }
              );
              this.close();
            } else {
              this.nbToastrService.warning(res.errors[0], "Falha", {
                duration: 3000
              });
            }
          },
          () => {
            this.nbToastrService.danger("Falha ao salvar o registro", "Falha", {
              duration: 2000
            });
            this.close();
          }
        );
      } else {
        this.data.login = this.data.email;
        this.data.tipoUsuario = "1";
        this.data.grupo = this.data.grupo.id;
        this.userService.save(this.data).subscribe(
          res => {
            if (res.hasSuccess) {
              this.nbToastrService.success(
                "Registro salvo com sucesso",
                "Sucesso",
                {
                  duration: 2000
                }
              );
              this.close();
            } else {
              this.nbToastrService.warning(res.errors[0], "Falha", {
                duration: 3000
              });
            }
          },
          () => {
            this.nbToastrService.danger("Falha ao salvar o registro", "Falha", {
              duration: 2000
            });
            this.close();
          }
        );
      }
    } else {
      let msgErro = "";
      if (this.validEmail || this.data.email != undefined)
        msgErro = "E-mail inválido." + "\n";

      if (this.data.nome == undefined || this.data.nome == "")
        msgErro = "Campo nome é de preenchimento obrigatório.";

      this.nbToastrService.danger(msgErro, "Falha", {
        duration: 2000
      });
      this.validacaoEmail();
    }
  }

  close() {
    this.helperService.closeModal(true);
    this.nbDialogRef.close();
  }
}
