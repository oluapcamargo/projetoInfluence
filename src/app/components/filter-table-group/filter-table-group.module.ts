import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbCardModule, NbSelectModule } from "@nebular/theme";
import { FilterTableComponent } from "./filter-table-group.component";

@NgModule({
  declarations: [FilterTableComponent],
  imports: [CommonModule, NbCardModule, NbSelectModule],
  exports: [FilterTableComponent]
})
export class FilterTableModule {}
