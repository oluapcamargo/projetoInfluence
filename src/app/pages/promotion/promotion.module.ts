import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PromotionRoutingModule } from "./promotion-routing.module";
import { PromotionComponent } from "./promotion.component";
import { FormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCheckboxModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule
} from "@nebular/theme";

import { NgxMaskModule } from "ngx-mask";
import { DataTableModule } from "../../components/data-table/data-table.module";
// import { TooltipDirective } from './../../utils/tooltip-directive';

@NgModule({
  declarations: [PromotionComponent],
  imports: [
    CommonModule,
    PromotionRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbSelectModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,

    DataTableModule,
    NbInputModule,
    NgxMaskModule.forRoot()
  ]
})
export class PromotionModule {}
