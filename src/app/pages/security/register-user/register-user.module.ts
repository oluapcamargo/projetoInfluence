import { DataTableModule } from "./../../../components/data-table/data-table.module";
import { FilterTableModule } from "./../../../components/filter-table/filter-table.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiSwitchModule } from "ngx-toggle-switch";
import { MatIconModule } from "@angular/material/icon";

import { RegisterUserRoutingModule } from "./register-user-routing.module";
import { RegisterUserComponent } from "./register-user.component";
import { NbCardModule, NbButtonModule } from "@nebular/theme";

@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    RegisterUserRoutingModule,
    FilterTableModule,
    DataTableModule,
    UiSwitchModule,
    MatIconModule,
    NbCardModule,
    NbButtonModule
  ],
  exports: [MatIconModule]
})
export class RegisterUserModule {}
