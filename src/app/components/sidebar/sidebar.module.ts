import { NgModule } from "@angular/core";
import { SidebarComponent } from "./sidebar.component";
import {
  NbSidebarModule,
  NbMenuModule,
  NbCardModule,
  NbTooltipModule
} from "@nebular/theme";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    NbSidebarModule,
    NbCardModule,
    NbMenuModule,
    NbTooltipModule
  ],
  exports: [SidebarComponent]
})
export class SidebarModule {}
