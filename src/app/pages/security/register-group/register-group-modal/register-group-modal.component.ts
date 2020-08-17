import { Component, OnInit } from "@angular/core";
import { NbDialogRef, NbDialogService, NbToastrService } from "@nebular/theme";
import { GroupService } from "src/app/services/group.service";
import { CompanyService } from "src/app/services/company.service";
import { HelperService } from "src/app/services/helper.service";

@Component({
  selector: "app-register-group-modal",
  templateUrl: "./register-group-modal.component.html",
  styleUrls: ["./register-group-modal.component.scss"]
})
export class RegisterGroupModalComponent implements OnInit {
  code;
  data = {
    nome: "",
    descricao: "",
    situacao: true,
    id: ""
  };
  validNome: boolean = true;
  validDescricao: boolean = true;
  companies = [];
  constructor(
    private nbToastrService: NbToastrService,
    private nbDialogRef: NbDialogRef<RegisterGroupModalComponent>,
    private groupService: GroupService,
    private companyService: CompanyService,
    private helperService: HelperService
  ) {}

  ngOnInit() {}

  close() {
    this.helperService.closeModal(true);
    this.nbDialogRef.close();
  }

  validacaoNome() {
    if (this.data.nome != null && this.data.nome.trim() != "")
      this.validNome = true;
    else this.validNome = false;
  }

  validacaoDescricao() {
    if (this.data.descricao != null && this.data.descricao.trim() != "")
      this.validDescricao = true;
    else this.validDescricao = false;
  }
  save() {
    if (this.data.nome.length > 0 && this.data.descricao.length > 0) {
      if (this.data.id.length == 0) {
        this.groupService.save(this.data).subscribe(
          res => {
            if (res.hasSuccess) {
              this.nbToastrService.success(
                "Registro salvo com sucesso",
                "Sucesso",
                {
                  duration: 3000
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
            this.nbToastrService.danger(
              "Perfil já cadastrado no sistema.",
              "Falha",
              {
                duration: 2000
              }
            );

            this.close();
          }
        );
      } else {
        this.groupService.update(this.data.id, this.data).subscribe(
          res => {
            if (res.hasSuccess) {
              this.nbToastrService.success(
                "Registro atualizado com sucesso",
                "Sucesso",
                {
                  duration: 3000
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
            this.nbToastrService.danger(
              "Perfil já cadastrado no sistema.",
              "Falha",
              {
                duration: 2000
              }
            );

            this.close();
          }
        );
      }
    } else {
      this.nbToastrService.danger(
        "Campo nome e descrição são de preenchimento obrigatório.",
        "Falha",
        {
          duration: 2000
        }
      );
    }
  }
}
