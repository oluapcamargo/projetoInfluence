import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PromotionRoutingModule } from "./../promotion-routing.module";
import { RegisterPromotionModalComponentComponent } from "./register-promotion-modal-component.component";
import { FormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCheckboxModule,
  NbCardModule,
  NbSelectModule,
  NbListModule,
  NbInputModule
} from "@nebular/theme";

import { NgxMaskModule } from "ngx-mask";
import { DataTableModule } from "../../../components/data-table/data-table.module";
// import { TooltipDirective } from './../../utils/tooltip-directive';

@NgModule({
  declarations: [RegisterPromotionModalComponentComponent],
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
    NbListModule,
    DataTableModule,
    NbInputModule,
    NgxMaskModule.forRoot()
  ]
})
export class RegisterPromotionModalComponentModule {}
