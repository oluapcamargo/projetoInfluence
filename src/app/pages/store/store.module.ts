import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreRoutingModule } from "./store-routing.module";
import { StoreComponent } from "./store.component";
import { FormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule,
  NbIconModule,
  NbTooltipModule,
  NbSpinnerModule
} from "@nebular/theme";
import { NgxMaskModule } from "ngx-mask";
import { DataTableModule } from "../../components/data-table/data-table.module";
import { FilterTableModule } from "../../components/filter-table/filter-table.module";
import { NgSelectModule } from "@ng-select/ng-select";
// import { TooltipDirective } from './../../utils/tooltip-directive';

@NgModule({
  declarations: [StoreComponent],
  imports: [
    CommonModule,
    StoreRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbSelectModule,
    NgSelectModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    FilterTableModule,
    DataTableModule,
    NbInputModule,
    NbTooltipModule,
    NbIconModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ]
})
export class StoreModule {}
