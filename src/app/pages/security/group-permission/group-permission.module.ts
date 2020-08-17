import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { GroupPermissionRoutingModule } from './group-permission-routing.module'
import { GroupPermissionComponent } from './group-permission.component'
import {
  NbCardModule,
  NbButtonModule,
  NbSelectModule,
  NbListModule,
  NbCheckboxModule,
  NbIconModule,
  NbTooltipModule,
} from '@nebular/theme'

@NgModule({
  declarations: [GroupPermissionComponent],
  imports: [
    CommonModule,
    GroupPermissionRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbListModule,
    NbCheckboxModule,
    NbIconModule,
    NbTooltipModule,
  ],
})
export class GroupPermissionModule {}
