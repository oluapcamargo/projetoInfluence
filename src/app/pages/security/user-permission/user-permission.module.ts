import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserPermissionRoutingModule } from "./user-permission-routing.module";
import { UserPermissionComponent } from "./user-permission.component";
import {
  NbCardModule,
  NbButtonModule,
  NbSelectModule,
  NbListModule,
  NbCheckboxModule,
  NbIconModule,
  NbTooltipModule
} from "@nebular/theme";

@NgModule({
  declarations: [UserPermissionComponent],
  imports: [
    CommonModule,
    UserPermissionRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbListModule,
    NbCheckboxModule,
    NbIconModule,
    NbTooltipModule
  ]
})
export class UserPermissionModule {}
