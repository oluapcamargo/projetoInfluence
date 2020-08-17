import { __awaiter, __decorate } from "tslib";
import { Component } from "@angular/core";
import { User } from "../../models/user";
let LoginComponent = class LoginComponent {
  constructor(router, authService, currentUser, alert) {
    this.router = router;
    this.authService = authService;
    this.currentUser = currentUser;
    this.alert = alert;
    this.user = new User();
    this.isLoading = false;
  }
  ngOnInit() {
    return __awaiter(this, void 0, void 0, function*() {
      this.authService.isLoggedIn.subscribe(res =>
        __awaiter(this, void 0, void 0, function*() {
          if (res) {
            const { tipoUsuario } = yield this.currentUser.getUser();
            this.navigateBasedOnUserType(tipoUsuario);
          }
        })
      );
      this.getCaptcha();
    });
  }
  login() {
    const { email, password, captchaId, resultado } = this.user;
    this.isLoading = true;
    this.authService.logIn(email, password, captchaId, resultado).subscribe(
      ({ value }) =>
        __awaiter(this, void 0, void 0, function*() {
          this.isLoading = false;
          if (value.authenticated) {
            const { token } = value;
            localStorage.setItem("access-token", token.accessToken);
            localStorage.setItem("refresh-token", token.refreshToken);
            const { tipoUsuario } = yield this.currentUser.getUser();
            this.authService.loggedIn.next(true);
            this.navigateBasedOnUserType(tipoUsuario);
          } else {
            this.isLoading = false;
            this.alert.warning(value.message);
          }
        }),
      err => {
        this.isLoading = false;
        this.alert.warning(err);
      }
    );
  }
  forgotPassword() {
    this.router.navigate(["/forgot-password"]);
  }
  navigateBasedOnUserType(tipoUsuario) {
    !tipoUsuario
      ? this.router.navigate(["security/user"])
      : this.router.navigate(["security/user"]);
  }
  getCaptcha() {
    return __awaiter(this, void 0, void 0, function*() {
      this.authService.getCaptcha("teste-ip").subscribe(({ value }) => {
        this.captcha = value;
        this.user.captchaId = value.id;
      });
    });
  }
  registerOperator() {
    this.router.navigate(["register-operator"]);
  }
};
LoginComponent = __decorate(
  [
    Component({
      selector: "app-login",
      templateUrl: "./login.component.html",
      styleUrls: ["./login.component.scss"]
    })
  ],
  LoginComponent
);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map
