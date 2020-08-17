import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RegisterPromotionModalComponentComponent } from "./register-promotion-modal-component.component";

const routes: Routes = [
  { path: "", component: RegisterPromotionModalComponentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPromotionModalRoutingModule {}
