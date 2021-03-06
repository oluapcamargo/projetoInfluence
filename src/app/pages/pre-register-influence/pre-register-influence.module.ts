import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreRegisterInfluenceComponent } from "./pre-register-influence.component";
import { PreRegisterInfluenceRoutingModule } from "./pre-register-influence-routing.module";
import { MatIconModule } from "@angular/material/icon";
import {MatCheckboxModule} from '@angular/material/checkbox';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule
} from "@nebular/theme";
import { NgxMaskModule } from "ngx-mask";
import { MatTabsModule } from "@angular/material/tabs";
import { NgSelectModule } from "@ng-select/ng-select";


// import { TabTipoServicoComponent } from "../../components/tab-tipo-servico/tab-tipo-servico.component";
// import { TabEmployeesComponent } from "../../components/tab-employees/tab-employees.component";

@NgModule({
  declarations: [PreRegisterInfluenceComponent],

  imports: [
    CommonModule,
    FormsModule,
    NbLayoutModule,
    ReactiveFormsModule,
    NbSidebarModule,
    NbSelectModule,NgSelectModule,
    MatIconModule,
    MatCheckboxModule,
    NbButtonModule,
    NbCardModule,
    MatTabsModule, // TabEmployeesComponent,
    NbInputModule,
    PreRegisterInfluenceRoutingModule,
    NgxMaskModule.forRoot()
  ]
})
export class PreRegisterInfluenceModule {}
