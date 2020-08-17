import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { User } from "../models/user";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { Permissions } from "../models/permissions";
import { take } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class CurrentUserService {
  id: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) {
    const { Id } = this.authService.decode();
    this.id = Id;
  }

  public async getUser(): Promise<User> {
    const { Id } = this.authService.decode();
    const res = await forkJoin(
      this.userService.fetch(Id),
      this.userService.fetchPermissions(Id)
    )
      .pipe(take(1))
      .toPromise();

    const user = res[0];
    const userPermissions = res[1].value;
    localStorage.setItem("person", btoa(JSON.stringify(user)));
    localStorage.setItem(
      "user-permissions",
      btoa(JSON.stringify(userPermissions))
    );
    return user.value;
  }

  public getEnumPermissions() {
    return Permissions;
  }

  public getPermissionsFromStorage(): any {
    const permissionsOnStorage = localStorage.getItem("user-permissions");
    const permissions = permissionsOnStorage
      ? JSON.parse(atob(permissionsOnStorage))
      : [];
    return permissions;
  }

  public validatePermissions(Userpermission: Permissions): boolean {
    const permissionsOnStorage = localStorage.getItem("user-permissions");
    const permissions = permissionsOnStorage
      ? JSON.parse(atob(permissionsOnStorage))
      : null;
    if (permissions && permissions.find(e => e.nome === Userpermission)) {
      return true;
    } else {
      return false;
    }
  }
}
