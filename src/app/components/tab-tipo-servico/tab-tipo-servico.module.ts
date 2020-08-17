import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbCardModule, NbSelectModule } from "@nebular/theme";
import { TabTipoServicoComponent } from "./tab-tipo-servico.component";
import { DataTableComponent } from "./../data-table/data-table.component";
@NgModule({
  declarations: [TabTipoServicoComponent, DataTableComponent],
  imports: [CommonModule, NbCardModule, NbSelectModule],
  exports: [TabTipoServicoComponent]
})
export class TabTipoServicoModule {}
