import { User } from "./../../models/user";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  user = new User();
  isLoading = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private nbToastrService: NbToastrService
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(["/login"]);
  }

  changePassword() {
    this.isLoading = true;
    this.authService.changePassword({ userName: this.user.email }).subscribe(
      res => {
        this.isLoading = false;
        if (res.hasSuccess) {
          this.nbToastrService.success(
            "Senha trocada com sucesso. Sua nova senha foi enviada por email",
            "Sucesso",
            {
              duration: 3000
            }
          );
          this.router.navigate(["/login"]);
        } else {
          this.nbToastrService.warning(res.errors[0], "Falha", {
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
}
