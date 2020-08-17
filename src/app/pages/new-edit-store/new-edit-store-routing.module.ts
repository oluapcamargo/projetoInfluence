import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NewEditStoreComponent } from "./new-edit-store.component";

const routes: Routes = [{ path: "", component: NewEditStoreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewEditStoreRoutingModule {}
