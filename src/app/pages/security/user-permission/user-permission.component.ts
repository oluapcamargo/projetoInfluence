import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "src/app/services/user.service";
import { DomainService } from "src/app/services/domain.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { NbDialogService } from "@nebular/theme";
import { CurrentUserService } from "src/app/services/current-user.service";
import { Util } from "src/app/utils/util";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-user-permission",
  templateUrl: "./user-permission.component.html",
  styleUrls: ["./user-permission.component.scss"]
})
export class UserPermissionComponent implements OnInit {
  users = [];
  data = {
    userId: "",
    permissaoId: ""
  };
  permissions = [];
  permissionsAdded = [];
  permissionsToAdd;
  filter = {
    selectedUser: "0"
  };
  public PermissionsToAddTemp = [];
  public PermissionsAddedTemp = [];
  checkRemove = false;
  checkAdd = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private domainService: DomainService,
    private nbToastrService: NbToastrService,
    public uService: CurrentUserService,
    private util: Util
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchPermissions();
  }
  fetchUsers() {
    this.userService.fetch("0").subscribe(({ value }) => {
      this.users = value;
    });
  }

  fetchPermissions() {
    this.domainService.fetchPermissions().subscribe(
      ({ value }) => {
        this.permissions = [];
        this.permissions = value;
      },
      () => {
        this.nbToastrService.danger("Falha ao carregar permissões.", "Falha", {
          duration: 2000
        });
        this.router.navigate(["security/login"]);
      }
    );
  }

  fetchUserPermissions(code: string) {
    this.fetchPermissions();
    this.userService.fetchPermissions(code).subscribe(
      ({ value }) => {
        this.permissionsAdded = [];
        this.permissionsAdded = value;
        this.permissions.forEach(item => {
          this.permissionsAdded.forEach(({ id }) => {
            if (item.id === id) {
              this.removePermission({ id });
            }
          });
        });
      },
      err => {
        this.permissions = [];
        this.permissionsAdded = [];
      }
    );
  }

  removePermissionsInUser() {
    if (this.PermissionsAddedTemp.length > 0) {
      this.permissionsAdded.forEach(e => {
        this.PermissionsAddedTemp.forEach(id => {
          if (e.id === id) {
            this.removePermissionAdded(e);
          }
        });
      });
    } else {
      this.nbToastrService.warning("Escolha ao menos uma permissão", "Atenção");
      return;
    }
  }

  showSuccess() {
    this.nbToastrService.success("Registro alterado com sucesso", "Sucesso", {
      duration: 3000,
      preventDuplicates: true
    });
  }

  showError() {
    this.nbToastrService.danger("Falha ao alterar registro", "Falha", {
      duration: 3000
    });
  }

  removePermissionAdded(permission) {
    this.userService
      .deletePermission(permission.permissaoUserId || permission.id)
      .subscribe(() => {
        this.permissionsAdded = this.permissionsAdded.filter(
          item => item.id !== permission.id
        );
        this.showSuccess();
        this.PermissionsAddedTemp = [];
        this.checkRemove = false;
        this.hasTooltip();
      });

    this.addPermissionBack(permission);
  }

  hasTooltip() {
    const tooltip = document.querySelectorAll(
      "div.cdk-overlay-container > div.cdk-overlay-connected-position-bounding-box"
    );
    tooltip[0].remove();
  }

  removePermission({ id }) {
    this.permissions = this.permissions.filter(item => item.id !== id);
  }

  addAll() {
    this.permissions.forEach(item => {
      this.addPermissionAdded(item);
      this.removePermission(item);
    });
  }

  addPermissionAdded(item) {
    this.removePermission(item);
    this.save(item);
  }
  save(permissaoId) {
    const userId = this.filter.selectedUser;
    const { id } = permissaoId;

    this.userService.savePermission({ userId, permissaoId: id }).subscribe(
      res => {
        this.permissionsAdded.push({ ...permissaoId, ...res.value });
        this.showSuccess();
        this.PermissionsToAddTemp = [];
        this.checkAdd = false;
        this.hasTooltip();
      },
      () => {
        this.showError();
      }
    );
  }

  addPermissionBack(item) {
    delete item.check;
    this.permissions.push(item);
  }

  PermissionsToAddAll(event) {
    this.checkAdd = event;
    this.changeValueInArrays(
      event,
      this.permissions,
      this.PermissionsToAddTemp
    );

    if (!event) {
      this.PermissionsToAddTemp = [];
    }
  }
  PermissionsAddedAll(event) {
    this.checkRemove = event;
    this.changeValueInArrays(
      event,
      this.permissionsAdded,
      this.PermissionsAddedTemp
    );

    if (!event) {
      this.PermissionsAddedTemp = [];
    }
  }

  setPermission(value, event) {
    this.setValueToggle(value, event, this.PermissionsToAddTemp);
  }

  setPermissionsInUser() {
    this.PermissionsToAddTemp.forEach(element => {
      this.PermissionsAddedTemp.push(element);
    });
  }

  setPermissionsadded(value, event) {
    this.setValueToggle(value, event, this.PermissionsAddedTemp);
  }

  setValueToggle(value, event: boolean, arr) {
    if (event) {
      if (arr.indexOf(value) === -1) {
        arr.push(value);
      }
    } else {
      if (arr.indexOf(value) > -1) {
        const index = arr.indexOf(value);
        arr.splice(index, 1);
      }
    }
  }

  changeValueInArrays(value: boolean, array, arrTemp) {
    if (value) {
      array.forEach(element => {
        element.check = true;
        this.setValueToggle(element.id, value, arrTemp);
      });
    } else {
      array.forEach(element => {
        element.check = false;
      });
      arrTemp = [];
    }
  }
}
