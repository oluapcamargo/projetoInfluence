import { RegisterGroupModalComponent } from "./pages/security/register-group/register-group-modal/register-group-modal.component";
import { RegisterUserModalComponent } from "./pages/security/register-user/register-user-modal/register-user-modal.component";
import { RegisterServiceTypeModalComponent } from "./pages/service-type/register-service-type-modal/register-service-type-modal.component";
import { StoreModalComponent } from "./pages/store/store-modal/store-modal.component";

import { saveAs } from "file-saver";

// import { RegisterStoreComponent } from "./pages/register-store/register-store.component";

import { AppChangePasswordComponent } from "./pages/security/register-user/app-change-password/app-change-password.component";

import { MatTabsModule } from "@angular/material/tabs";
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule} from '@angular/material/button';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatToolbarModule } from '@angular/material/toolbar';

// import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
// import { MatFileUploadModule } from "angular-material-fileupload";
import { UiSwitchModule } from "ngx-toggle-switch";
// import { TooltipDirective } from "./utils/tooltip-directive";

import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

import {
  registerLocaleData,
  HashLocationStrategy,
  LocationStrategy
} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  NbThemeModule,
  NbDatepickerModule,
  NbLayoutModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbToastrModule,
  NbListModule,
  NbIconModule,
  NbMenuModule,
  NbChatModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule,
  NbButtonModule,
  NbTabsetModule
} from "@nebular/theme";
import { AuthGuard } from "./guards/auth-guard.service";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { Interceptor } from "./services/intercept.service";
import { NgxMaskModule } from "ngx-mask";
import * as ptBR from "date-fns/locale/pt-BR/index.js";
import { TopbarModule } from "./components/topbar/topbar.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SidebarModule } from "./components/sidebar/sidebar.module";
import { FooterModule } from "./components/footer/footer.module";
import { AppDecisionAlertComponent } from "./components/app-decision-alert/app-decision-alert.component";
import { RegisterPromotionModalComponentComponent } from "./pages/promotion/register-promotion-modal-component/register-promotion-modal-component.component";
import { TabTipoServicoComponent } from "./components/tab-tipo-servico/tab-tipo-servico.component";
import { TabPhotosComponent } from "./components/tab-photos/tab-photos.component";

import { TabDadosGeraisStoreComponent } from "./components/tab-dados-gerais-store/tab-dados-gerais-store.component";
import { TabEmployeesComponent } from "./components/tab-employees/tab-employees.component";
import { UserPermissionComponent } from "./pages/security/user-permission/user-permission.component";
import { TabStorePromotionComponent } from "./components/tab-store-promotion/tab-store-promotion.component";
import { TabServicesPromotionComponent } from "./components/tab-services-promotion/tab-services-promotion.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { YesNoPipe } from "./pipes/yes-no.pipe";
import { defaultMaskConfig } from "./models/maskConfig";
// import { PreRegisterInfluenceComponent } from './pages/pre-register-influence/pre-register-influence.component';

// import { PromotionComponent } from "./pages/promotion/promotion.component";
// import { EventComponent } from "./pages/event/event.component";
// import { StoreComponent } from "./pages/store/store.component";
// import { AttendanceComponent } from "./pages/attendance/attendance.component";
// import { DashboardComponent } from './pages/dashboard/dashboard.component';

registerLocaleData(localePt);

export function tokenGetter() {
  return localStorage.getItem("access_token");
}
@NgModule({
  declarations: [
    AppComponent,
    RegisterUserModalComponent,
    RegisterServiceTypeModalComponent,
    RegisterGroupModalComponent,
    AppDecisionAlertComponent,
    AppChangePasswordComponent,
    StoreModalComponent,
    RegisterPromotionModalComponentComponent,
    TabTipoServicoComponent,
    TabDadosGeraisStoreComponent,
    TabEmployeesComponent,
    TabPhotosComponent,
    UserPermissionComponent,
    TabStorePromotionComponent,
    TabServicesPromotionComponent,
    YesNoPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    UiSwitchModule,
    FormsModule,
    LoadingBarHttpClientModule,
    AppRoutingModule,
    NbIconModule,
    NgbModule,
    NbCardModule,
    NbChatModule,
    NgSelectModule,
    MatIconModule,
    // MatSliderModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatButtonModule,
    // MatCardModule,
    MatTabsModule,
    NbSelectModule,
    NbListModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    NbEvaIconsModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "isalontheme" }),
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    NbDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(defaultMaskConfig),
    NbDateFnsDateModule.forRoot({
      parseOptions: { locale: ptBR },
      formatOptions: { locale: ptBR }
    }),
    NbToastrModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbTabsetModule,
    NbLayoutModule,
    TopbarModule,
    SidebarModule,
    FooterModule
  ],
  exports: [],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  entryComponents: [
    RegisterUserModalComponent,
    RegisterGroupModalComponent,
    StoreModalComponent,

    AppDecisionAlertComponent,
    RegisterServiceTypeModalComponent,
    AppChangePasswordComponent,
    RegisterPromotionModalComponentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
