import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  ElementRef
} from "@angular/core";

import { AuthService } from "../../../../services/auth.service";
import { HelperService } from "src/app/services/helper.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { CurrentUserService } from "../../../../services/current-user.service";

@Component({
  selector: "app-app-change-password",
  templateUrl: "./app-change-password.component.html",
  styleUrls: ["./app-change-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppChangePasswordComponent implements OnInit {
  id: any;
  dataAux: any = [];
  code: string;
  aux: string;
  senhaAntiga: string;
  senhaNova: string;
  confirmacaoSenha: string;
  @Input() data: any[];
  userName: string;

  constructor(
    //protected dialogRef: NbDialogRef<AppChangePasswordComponent>,

    private nbToastrService: NbToastrService,
    private authService: AuthService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.dataAux = [
      (this.code = ""),
      (this.senhaAntiga = ""),
      (this.senhaNova = ""),
      (this.confirmacaoSenha = ""),
      (this.userName = "")
    ];
    this.configuraElement();
  }

  configuraElement() {
    if (this.data) {
      this.dataAux = this.data;
    }
  }

  close() {
    this.helperService.closeModal(true);
    //this.close();
  }

  valicaoSenhas() {
    if (
      this.dataAux.senhaNova != this.dataAux.confirmacaoSenha &&
      this.dataAux.senhaNova != "" &&
      this.dataAux.confirmacaoSenha != "" &&
      this.dataAux.senhaNova != undefined &&
      this.dataAux.confirmacaoSenha != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }
  valicaoSenhasIguais() {
    if (
      this.dataAux.senhaAntiga == this.dataAux.senhaNova &&
      this.dataAux.senhaAntiga != "" &&
      this.dataAux.senhaNova != "" &&
      this.dataAux.senhaAntiga != undefined &&
      this.dataAux.senhaNova != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  save() {
    this.dataAux.userName = this.dataAux.login;
    this.authService.updatePassword(this.dataAux).subscribe(
      res => {
        if (res.hasSuccess) {
          this.nbToastrService.success(
            "Senha alterada com sucesso",
            "Sucesso",
            {
              duration: 2000
            }
          );
        } else {
          this.aux = "";
          for (let i = 0; i < res.errors.length; i++) {
            this.aux += "\n" + res.errors[i];
          }
          this.nbToastrService.danger(
            "Falha ao alterar a senha." + this.aux,
            "Falha",
            {
              duration: 3000
            }
          );
        }
      },

      () => {
        this.nbToastrService.danger("Falha ao alterar a senha.", "Falha", {
          duration: 2000
        });
      }
    );
  }
}
