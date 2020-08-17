import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserPermissionComponent } from "./user-permission.component";

const routes: Routes = [{ path: "", component: UserPermissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPermissionRoutingModule {}
