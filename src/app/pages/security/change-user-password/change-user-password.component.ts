import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { HelperService } from "src/app/services/helper.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { UserService } from "../../../services/user.service";

import { CurrentUserService } from "../../../services/current-user.service";
import { AuthPwdType } from "src/app/models/authpwd";

@Component({
  selector: "app-change-user-password",
  templateUrl: "./change-user-password.component.html",
  styleUrls: ["./change-user-password.component.scss"]
})
export class ChangeUserPasswordComponent implements OnInit {
  SenhaAntiga: string;
  SenhaNova: string;
  dataAux: any = [];
  validconfSenhaNova: boolean = false;
  validSenhaNova: boolean = false;
  validSenhaVelha: boolean = false;

  aux: string;
  user: string;
  param: AuthPwdType = new AuthPwdType();

  confirmacaoSenha: string;
  constructor(
    private nbToastrService: NbToastrService,
    private authService: AuthService,
    private helperService: HelperService,
    private currentUserService: CurrentUserService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.dataAux = [];
    this.user = localStorage.getItem("UserName");
  }

  atualizaUser() {
    var element: any;
    element = document.getElementsByClassName("user-name");
    this.user = localStorage.getItem("UserName");
    this.save();
  }

  validaSenhaAtual() {
    if (
      this.dataAux.SenhaAntiga != undefined &&
      this.dataAux.SenhaAntiga.length > 0
    )
      this.validSenhaVelha = false;
    else this.validSenhaVelha = true;
  }
  validaSenhaNova() {
    if (
      this.dataAux.SenhaNova != undefined &&
      this.dataAux.SenhaNova.length > 0
    )
      this.validSenhaNova = false;
    else this.validSenhaNova = true;
  }
  validaconfSenhaNova() {
    if (
      this.dataAux.confirmacaoSenha != undefined &&
      this.dataAux.confirmacaoSenha.length > 0
    )
      this.validconfSenhaNova = false;
    else this.validconfSenhaNova = true;
  }

  valicaoSenhas() {
    if (
      this.dataAux.SenhaNova != this.dataAux.confirmacaoSenha &&
      this.dataAux.SenhaNova != "" &&
      this.dataAux.confirmacaoSenha != "" &&
      this.dataAux.SenhaNova != undefined &&
      this.dataAux.confirmacaoSenha != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }
  valicaoSenhasIguais() {
    if (
      this.dataAux.SenhaAntiga == this.dataAux.SenhaNova &&
      this.dataAux.SenhaAntiga != "" &&
      this.dataAux.SenhaNova != "" &&
      this.dataAux.SenhaAntiga != undefined &&
      this.dataAux.SenhaNova != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  save() {
    this.validaSenhaAtual();
    this.validaSenhaNova();
    this.validaconfSenhaNova();
    if (this.user == undefined) this.atualizaUser();
    if (
      this.user != undefined &&
      this.user.length > 0 &&
      this.dataAux.SenhaNova != undefined &&
      this.dataAux.SenhaNova.length > 0 &&
      this.dataAux.SenhaNova == this.dataAux.confirmacaoSenha &&
      this.dataAux.SenhaAntiga != undefined &&
      this.dataAux.SenhaAntiga.length > 0 &&
      !this.validconfSenhaNova &&
      !this.validSenhaNova &&
      !this.validSenhaVelha
    ) {
      this.param.userName = this.user;
      this.param.senhaNova = this.dataAux.SenhaNova;
      this.param.senhaAntiga = this.dataAux.SenhaAntiga;

      this.authService.updatePassword(this.param).subscribe(
        res => {
          if (res.hasSuccess) {
            this.nbToastrService.success(
              "Senha alterada com sucesso",
              "Sucesso",
              {
                duration: 2000
              }
            );
            this.ngOnInit();
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
    } else {
      let msg = "";
      if (
        this.validconfSenhaNova ||
        this.dataAux.senhaNova != this.dataAux.confirmacaoSenha
      )
        msg = "Confimação de senha não confere.";
      else if (this.validSenhaNova) msg += "Senha nova inválida.";
      else if (this.validSenhaVelha) msg += "Senha velha inválida.";
      else if (this.dataAux.length == 0)
        msg += "É necessário o preenchimento dos campos obrigatórios.";

      this.validaSenhaNova();
      this.validaSenhaAtual();
      this.validaconfSenhaNova();

      if (
        this.validSenhaNova &&
        this.validSenhaVelha &&
        this.validconfSenhaNova
      )
        msg = "É necessário o preenchimento dos campos obrigatórios.";

      this.nbToastrService.danger(msg, "Falha", {
        duration: 2000
      });
    }
  }
}
