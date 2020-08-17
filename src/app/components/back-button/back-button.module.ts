import { NgModule } from '@angular/core'
import { BackButtonComponent } from './back-button.component'
import { NbEvaIconsModule } from '@nebular/eva-icons'
import { NbIconModule, NbButtonModule } from '@nebular/theme'

@NgModule({
  declarations: [BackButtonComponent],
  imports: [NbButtonModule, NbEvaIconsModule, NbIconModule],
  exports: [BackButtonComponent],
})
export class BackButtonModule {}
