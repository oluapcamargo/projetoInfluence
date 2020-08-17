import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module'
import { ForgotPasswordComponent } from './forgot-password.component'
import {
  NbInputModule,
  NbCardModule,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule
} from '@nebular/theme'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    FormsModule,
  ],
})
export class ForgotPasswordModule {}
