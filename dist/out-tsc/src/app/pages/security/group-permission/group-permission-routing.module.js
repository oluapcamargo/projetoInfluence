import { __decorate } from "tslib";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GroupPermissionComponent } from "./group-permission.component";
const routes = [{ path: "", component: GroupPermissionComponent }];
let GroupPermissionRoutingModule = class GroupPermissionRoutingModule {};
GroupPermissionRoutingModule = __decorate(
  [
    NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    })
  ],
  GroupPermissionRoutingModule
);
export { GroupPermissionRoutingModule };
//# sourceMappingURL=group-permission-routing.module.js.map
