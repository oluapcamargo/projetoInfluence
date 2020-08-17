import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServiceTypeRoutingModule } from "./service-type-routing.module";
import { ServiceTypeComponent } from "./service-type.component";

import { FormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbSelectModule,
  NbCardModule,
  NbInputModule,
  NbIconModule,
  NbTooltipModule,
  NbSpinnerModule
} from "@nebular/theme";
import { NgxMaskModule } from "ngx-mask";
import { DataTableModule } from "./../../components/data-table/data-table.module";
import { FilterTableModule } from "./../../components/filter-table/filter-table.module";
// import { TooltipDirective } from './../../utils/tooltip-directive';

@NgModule({
  declarations: [ServiceTypeComponent],
  imports: [
    CommonModule,
    ServiceTypeRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbSelectModule,
    NbTooltipModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    FilterTableModule,
    DataTableModule,
    NbInputModule,
    NgxMaskModule.forRoot(),
    NbIconModule
  ]
})
export class ServiceTypeModule {}
