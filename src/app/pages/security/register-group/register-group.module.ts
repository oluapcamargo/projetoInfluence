import { DataTableModule } from "./../../../components/data-table/data-table.module";
import { FilterTableModule } from "./../../../components/filter-table/filter-table.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterGroupRoutingModule } from "./register-group-routing.module";
import { RegisterGroupComponent } from "./register-group.component";
import { NbCardModule, NbButtonModule } from "@nebular/theme";
// import { TooltipDirective } from './../../../utils/tooltip-directive';

@NgModule({
  declarations: [RegisterGroupComponent],
  imports: [
    CommonModule,
    RegisterGroupRoutingModule,
    FilterTableModule,
    DataTableModule,
    // TooltipDirective,
    NbCardModule,
    NbButtonModule
  ]
})
export class RegisterGroupModule {}
