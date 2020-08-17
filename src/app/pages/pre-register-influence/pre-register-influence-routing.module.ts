import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PreRegisterInfluenceComponent } from "./pre-register-influence.component";

const routes: Routes = [{ path: "", component: PreRegisterInfluenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRegisterInfluenceRoutingModule {}
