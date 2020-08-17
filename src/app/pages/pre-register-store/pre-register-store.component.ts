import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Util } from "src/app/utils/util";
import { UtilService } from "../../services/util.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ValidateBrService } from "angular-validate-br";

import { ServiceTypeService } from "src/app/services/service-type.service";

import { UserService } from "src/app/services/user.service";
import { has } from "lodash";
import { UserAdd } from "src/app/models/userAdd";

@Component({
  selector: "app-pre-register-store",
  templateUrl: "./pre-register-store.component.html",
  styleUrls: ["./pre-register-store.component.scss"]
})
export class PreRegisterStoreComponent implements OnInit {
  data = new UserAdd();
  mask = "";
  confSenhaValid = false;
  storeForm = this.fb.group({
    documento: ["", [Validators.required, Validators.maxLength(18)]],
    nome: ["", [Validators.required, Validators.maxLength(100)]],
    email: ["", [Validators.required, Validators.email]],
    telefone: ["", [Validators.required, Validators.maxLength(100)]],
    password: ["", [Validators.required, Validators.maxLength(100)]],
    passwordConfirm: ["", [Validators.required, Validators.maxLength(100)]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,

    private userService: UserService,
    private nbToastrService: NbToastrService,
    private util: Util,
    private utilService: UtilService,
    private serviceTypeService: ServiceTypeService,
    private elementRef: ElementRef,
    private validateBrService: ValidateBrService
  ) {}

  ngOnInit() {
    this.data = new UserAdd();
  }

  validacaoSenhaContraSenha() {
    let senha = this.storeForm.get("password").value;
    let confsenha = this.storeForm.get("passwordConfirm").value;
    if (senha != confsenha) {
      this.nbToastrService.warning(
        "Confirmação de senha diferente da senha.",
        "Falha",
        {
          duration: 2000
        }
      );
      this.confSenhaValid = true;

      return false;
    } else {
      this.confSenhaValid = false;
      this.data.password = this.storeForm.get("password").value;
      this.data.documento = this.storeForm.get("documento").value;
      this.data.nome = this.storeForm.get("nome").value;
      this.data.telefone = this.storeForm.get("telefone").value;
      this.data.login = this.storeForm.get("email").value;
      this.data.email = this.storeForm.get("email").value;
      this.data.tipoUsuario = "Empresa";

      return true;
    }
  }

  cpfcnpjmask() {
    const value = this.storeForm.get("documento").value;
    console.log(value, value.length, this.storeForm);
    if (value.length <= 14) {
      this.mask = "00.000.000/0000-00";
    } else {
      this.mask = "00.000.0000-00";
    }
  }

  goBack() {
    this.router.navigate(["/login"]);
  }

  showErrorToastr(
    menssagem: string = "Falha ao salvar/carregar o registro.",
    erro: any
  ) {
    if (erro.error) {
      Object.entries(erro.error).map(erroEncontrado => {
        console.error(erroEncontrado);
        this.nbToastrService.warning(erroEncontrado, "Falha", {
          duration: 4000
        });
      });
    } else {
      this.nbToastrService.warning(menssagem, "Falha", {
        duration: 2000
      });
    }
  }

  newStore() {
    if (this.validacaoSenhaContraSenha()) {
      this.userService.save(this.data).subscribe(
        res => {
          if (res.success) {
            this.nbToastrService.success(
              "Registro salvo com sucesso, agora você já pode realizar o login no sistema.",
              "Sucesso",
              {
                duration: 4000
              }
            );
            this.goBack();
          } else
            this.nbToastrService.danger(res.message, "Falha", {
              duration: 5000
            });
        },
        () => {
          this.nbToastrService.danger("Falha ao salvar o registro", "Falha", {
            duration: 5000
          });
          this.goBack();
        }
      );
    }
  }
}
