import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

interface RouterSearchable {
  path?: string;
  component?: any;
  searchName?: string;
  redirectTo?: string;
  pathMatch?: string;
  canActivate?: any;
  data?: { role: string };
  children?: RouterSearchable[];
  outlet?: string;
}

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginModule)
  },

  {
    path: "forgot-password",
    loadChildren: () =>
      import("./pages/forgot-password/forgot-password.module").then(
        m => m.ForgotPasswordModule
      )
  },
  {
    path: "pre-register-store",
    loadChildren: () =>
      import("./pages/pre-register-store/pre-register-store.module").then(
        m => m.PreRegisterStoreModule
      )
  },
  {
    path: "pre-register-influence",
    loadChildren: () =>
      import(
        "./pages/pre-register-influence/pre-register-influence.module"
      ).then(m => m.PreRegisterInfluenceModule)
  },

  {
    path: "security/user",
    loadChildren: () =>
      import("./pages/security/register-user/register-user.module").then(
        m => m.RegisterUserModule
      )
  },
  {
    path: "security/group",
    loadChildren: () =>
      import("./pages/security/register-group/register-group.module").then(
        m => m.RegisterGroupModule
      )
  },
  {
    path: "security/group-permission",
    loadChildren: () =>
      import("./pages/security/group-permission/group-permission.module").then(
        m => m.GroupPermissionModule
      )
  },
  {
    path: "security/user-data",
    loadChildren: () =>
      import("./pages/security/user-data/user-data.module").then(
        m => m.UserDataModule
      )
  },
  {
    path: "security/change-user-password",
    loadChildren: () =>
      import(
        "./pages/security/change-user-password/change-user-password.module"
      ).then(m => m.ChangeUserPasswordModule)
  },
  {
    path: "register/store",
    loadChildren: () =>
      import("./pages/store/store.module").then(m => m.StoreModule)
  },

  {
    path: "register/promotion",
    loadChildren: () =>
      import("./pages/promotion/promotion.module").then(m => m.PromotionModule)
  },
  {
    path: "register/service-type",
    loadChildren: () =>
      import("./pages/service-type/service-type.module").then(
        m => m.ServiceTypeModule
      )
  },

  {
    path: "dashboard",
    loadChildren: () =>
      import("./pages/dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "register/store/new-edit-store",
    loadChildren: () =>
      import("./pages/new-edit-store/new-edit-store.module").then(
        m => m.NewEditStoreModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
