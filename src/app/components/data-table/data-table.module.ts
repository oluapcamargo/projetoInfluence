import { NgModule } from "@angular/core";
import { DataTableComponent } from "./data-table.component";
import {
  NbTreeGridModule,
  NbInputModule,
  NbCardModule,
  NbDialogModule
} from "@nebular/theme";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CommonModule } from "@angular/common";
import { UiSwitchModule } from "ngx-toggle-switch";
import { MatIconModule } from "@angular/material/icon";

import { FormsModule } from "@angular/forms";
import { SafePipe } from "../../pipes/safe.pipe";
import { FilterPipe } from "../../pipes/filter.pipe";

@NgModule({
  declarations: [DataTableComponent, SafePipe, FilterPipe],
  entryComponents: [],
  imports: [
    CommonModule,
    UiSwitchModule,
    FormsModule,
    MatIconModule,
    NbTreeGridModule,
    NbInputModule,
    NgbModule,
    NbCardModule,
    NbDialogModule.forRoot()
  ],
  exports: [DataTableComponent, MatIconModule]
})
export class DataTableModule {}
