import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterGroupComponent } from './register-group.component';

const routes: Routes = [{ path: '', component: RegisterGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterGroupRoutingModule { }
