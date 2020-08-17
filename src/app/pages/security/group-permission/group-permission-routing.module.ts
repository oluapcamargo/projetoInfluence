import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPermissionComponent } from './group-permission.component';

const routes: Routes = [{ path: '', component: GroupPermissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupPermissionRoutingModule { }
