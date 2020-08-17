import { __decorate } from "tslib";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password.component";
const routes = [{ path: "", component: ForgotPasswordComponent }];
let ForgotPasswordRoutingModule = class ForgotPasswordRoutingModule {};
ForgotPasswordRoutingModule = __decorate(
  [
    NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    })
  ],
  ForgotPasswordRoutingModule
);
export { ForgotPasswordRoutingModule };
//# sourceMappingURL=forgot-password-routing.module.js.map
