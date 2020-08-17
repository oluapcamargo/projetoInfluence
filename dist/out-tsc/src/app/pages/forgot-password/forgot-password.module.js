import { __decorate } from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgotPasswordRoutingModule } from "./forgot-password-routing.module";
import { ForgotPasswordComponent } from "./forgot-password.component";
import {
  NbInputModule,
  NbCardModule,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule
} from "@nebular/theme";
import { FormsModule } from "@angular/forms";
let ForgotPasswordModule = class ForgotPasswordModule {};
ForgotPasswordModule = __decorate(
  [
    NgModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        NbLayoutModule,
        NbSidebarModule,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        FormsModule
      ]
    })
  ],
  ForgotPasswordModule
);
export { ForgotPasswordModule };
//# sourceMappingURL=forgot-password.module.js.map
