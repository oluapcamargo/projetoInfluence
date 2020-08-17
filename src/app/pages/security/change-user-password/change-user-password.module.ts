import { DataTableModule } from "../../../components/data-table/data-table.module";
import { FilterTableModule } from "../../../components/filter-table/filter-table.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiSwitchModule } from "ngx-toggle-switch";
import { MatIconModule } from "@angular/material/icon";

import { ChangeUserPasswordRoutingModule } from "./change-user-password-routing.module";
import { ChangeUserPasswordComponent } from "./change-user-password.component";
import { NbCardModule, NbButtonModule } from "@nebular/theme";

@NgModule({
  declarations: [ChangeUserPasswordComponent],
  imports: [
    CommonModule,
    ChangeUserPasswordRoutingModule,
    FilterTableModule,
    DataTableModule,
    UiSwitchModule,
    MatIconModule,
    NbCardModule,
    NbButtonModule
  ],
  exports: [MatIconModule]
})
export class ChangeUserPasswordModule {}
