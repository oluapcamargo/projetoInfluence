import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PreRegisterStoreComponent } from "./pre-register-store.component";

const routes: Routes = [{ path: "", component: PreRegisterStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRegisterStoreRoutingModule {}
