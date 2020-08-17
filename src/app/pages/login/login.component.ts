import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CurrentUserService } from "../../services/current-user.service";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  user = new User();
  isLoading = false;
  captcha: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUser: CurrentUserService,
    private alert: AlertService
  ) {}

  async ngOnInit() {
    this.authService.isLoggedIn.subscribe(async res => {
      if (res) {
        this.navigateBasedOnUserType(localStorage.TipoUsuario);
      }
    });
    // this.getCaptcha();
  }

  login() {
    const { email, password, captchaId, resultado } = this.user;
    this.isLoading = true;

    this.authService.logIn(email, password, captchaId, resultado).subscribe(
      async ({ value }) => {
        this.isLoading = false;

        if (value.authenticated) {
          const { token } = value.token;
          localStorage.setItem(
            "access-token",
            token == undefined ? value.token.accessToken : token.accessToken
          );
          localStorage.setItem(
            "refresh-token",
            token == undefined ? value.token.refreshToken : token.refreshToken
          );
          localStorage.setItem("UserName", value.email);
          localStorage.setItem("TipoUsuario", value.tipoUsuario);
          localStorage.setItem("Id", value.id);
          this.currentUser.id = value.id;

          localStorage.setItem("Name", value.nome);
          const { tipoUsuario } = value.tipoUsuario;
          if (value.tipoUsuario == 2) {
            this.alert.warning("Usuário sem permissão de acesso.");
            this.authService.logout();
          } else {
            this.authService.loggedIn.next(true);

            this.navigateBasedOnUserType(value.tipoUsuario);
          }
        } else {
          this.isLoading = false;
          // this.alert.warning(
          //   value.message == "" ? "Usuário ou senha inválidos." : value.message
          // );
        }
      },
      err => {
        this.isLoading = false;
        this.alert.warning(err);
      }
    );
  }

  forgotPassword() {
    this.router.navigate(["/forgot-password"]);
  }

  navigateBasedOnUserType(tipoUsuario: number) {
    !tipoUsuario
      ? this.router.navigate(["dashboard"])
      : this.router.navigate(["security/user-data"]);
  }

  // async getCaptcha() {
  //   this.authService.getCaptcha("teste-ip").subscribe(({ value }) => {
  //     this.captcha = value;
  //     this.user.captchaId = value.id;
  //   });
  // }

  registerOperator() {
    this.router.navigate(["/pre-register-influence"]);
  }
  registerEmpresa() {
    this.router.navigate(["/pre-register-store"]);
  }

  testeLogin() {
    this.router.navigate(["/login-teste"]);
  }
}
