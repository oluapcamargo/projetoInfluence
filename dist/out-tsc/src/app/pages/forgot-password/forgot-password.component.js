import { __decorate } from "tslib";
import { User } from "./../../models/user";
import { Component } from "@angular/core";
let ForgotPasswordComponent = class ForgotPasswordComponent {
  constructor(router, authService, nbToastrService) {
    this.router = router;
    this.authService = authService;
    this.nbToastrService = nbToastrService;
    this.user = new User();
    this.isLoading = false;
  }
  ngOnInit() {}
  goBack() {
    this.router.navigate(["/login"]);
  }
  changePassword() {
    this.isLoading = true;
    this.authService.changePassword({ userName: this.user.email }).subscribe(
      res => {
        this.isLoading = false;
        if (res) {
          this.nbToastrService.success(
            "Senha trocada com sucesso. Sua nova senha foi enviada por email",
            "Sucesso",
            {
              duration: 3000
            }
          );
        } else {
          this.nbToastrService.warning("Falha ao trocar a senha", "Falha", {
            duration: 3000
          });
        }
      },
      err => {
        this.isLoading = false;
        this.showErrorToastr(undefined, err);
      }
    );
  }
  showErrorToastr(menssagem = "Falha ao salvar/carregar o registro.", erro) {
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
};
ForgotPasswordComponent = __decorate(
  [
    Component({
      selector: "app-forgot-password",
      templateUrl: "./forgot-password.component.html",
      styleUrls: ["./forgot-password.component.scss"]
    })
  ],
  ForgotPasswordComponent
);
export { ForgotPasswordComponent };
//# sourceMappingURL=forgot-password.component.js.map
