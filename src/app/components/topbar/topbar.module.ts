import { NgModule } from "@angular/core";
import { TopbarComponent } from "./topbar.component";
import {
  NbIconModule,
  NbButtonModule,
  NbActionsModule,
  NbUserModule,
  NbSearchModule,
  NbContextMenuModule,
  NbTooltipModule
} from "@nebular/theme";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [TopbarComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbSearchModule,
    NbContextMenuModule,
    NbTooltipModule
  ],
  exports: [TopbarComponent]
})
export class TopbarModule {}
