import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewEditStoreRoutingModule } from "./new-edit-store-routing.module";
import { NewEditStoreComponent } from "./new-edit-store.component";
import {
  NbSpinnerModule,
  NbCardModule,
  NbInputModule,
  NbCheckboxModule,
  NbButtonModule,
  NbTabsetModule
} from "@nebular/theme";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrosInputModule } from "../../components/erros-input/erros-input.module";
import { AngularValidateBrLibModule } from "angular-validate-br";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxMaskModule } from "ngx-mask";
import { defaultMaskConfig } from "src/app/models/maskConfig";

@NgModule({
  declarations: [NewEditStoreComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NbCardModule,
    NbSpinnerModule,
    NbButtonModule,
    NewEditStoreRoutingModule,
    ErrosInputModule,
    NbInputModule,
    AngularValidateBrLibModule,
    NgSelectModule,
    NbCheckboxModule,
    NbTabsetModule,
    NgxMaskModule.forRoot(defaultMaskConfig)
  ]
})
export class NewEditStoreModule {}
