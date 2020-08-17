import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule
} from "@nebular/theme";
import { NgxMaskModule } from "ngx-mask";
import { DataTableModule } from "../../components/data-table/data-table.module";
import { FilterTableModule } from "../../components/filter-table/filter-table.module";
// import { TooltipDirective } from './../../utils/tooltip-directive';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbSelectModule,
    NbButtonModule,
    NbCardModule,
    FilterTableModule,
    DataTableModule,
    NbInputModule,
    NgxMaskModule.forRoot()
  ]
})
export class DashboardModule {}
