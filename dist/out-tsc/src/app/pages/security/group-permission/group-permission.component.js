import { __decorate } from "tslib";
import { Component } from "@angular/core";
let GroupPermissionComponent = class GroupPermissionComponent {
  constructor(groupService, companyService, domainService, nbToastrService) {
    this.groupService = groupService;
    this.companyService = companyService;
    this.domainService = domainService;
    this.nbToastrService = nbToastrService;
    this.companies = [];
    this.groups = [];
    this.data = {
      grupoId: "",
      permissaoId: ""
    };
    this.permissions = [];
    this.permissionsAdded = [];
    this.filter = {
      selectedCompany: "0",
      selectedGroup: "0"
    };
    this.PermissionsToAddTemp = [];
    this.PermissionsAddedTemp = [];
    this.checkRemove = false;
    this.checkAdd = false;
  }
  ngOnInit() {
    this.fetchCompany();
    this.fetchPermissions();
  }
  fetchGroups(code) {
    this.groupService.fetch(code).subscribe(({ value }) => {
      this.groups = value;
    });
  }
  fetchCompany() {
    this.companyService.fetch().subscribe(({ value }) => {
      this.companies = value;
    });
  }
  hasTooltip() {
    const tooltip = document.querySelectorAll(
      "div.cdk-overlay-container > div.cdk-overlay-connected-position-bounding-box"
    );
    tooltip[0].remove();
  }
  onCompanyChange(id) {
    this.fetchGroups(id);
  }
  addPermissionAdded(item) {
    this.removePermission(item);
    this.save(item);
  }
  addPermissionBack(item) {
    delete item.check;
    this.permissions.push(item);
  }
  removePermissionAdded(permission) {
    this.groupService
      .deletePermission(permission.permissaoGrupoId || permission.id)
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
  removePermission({ id }) {
    this.permissions = this.permissions.filter(item => item.id !== id);
  }
  addAll() {
    this.permissions.forEach(item => {
      this.addPermissionAdded(item);
      this.removePermission(item);
    });
  }
  removeAll() {
    this.permissionsAdded.forEach(item => {
      this.removePermissionAdded(item);
    });
  }
  save(permissaoId) {
    const grupoId = this.filter.selectedGroup;
    const { id } = permissaoId;
    this.groupService.savePermission({ grupoId, permissaoId: id }).subscribe(
      res => {
        this.permissionsAdded.push(
          Object.assign(Object.assign({}, permissaoId), res.value)
        );
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
  fetchPermissions() {
    this.domainService.fetchPermissions().subscribe(({ value }) => {
      this.permissions = [];
      this.permissions = value;
    });
  }
  fetchGroupPermissions(code) {
    this.fetchPermissions();
    this.groupService.fetchGroupPermissions(code).subscribe(
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
  setPermissionsadded(value, event) {
    this.setValueToggle(value, event, this.PermissionsAddedTemp);
  }
  changeValueInArrays(value, array, arrTemp) {
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
  setPermissionsInGrup() {
    if (this.PermissionsToAddTemp.length > 0) {
      this.permissions.forEach(e => {
        this.PermissionsToAddTemp.forEach(id => {
          if (e.id === id) {
            this.addPermissionAdded(e);
          }
        });
      });
    } else {
      this.nbToastrService.warning("Escolha ao menos uma permissão", "Atenção");
      return;
    }
  }
  removePermissionsInGrup() {
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
  setValueToggle(value, event, arr) {
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
};
GroupPermissionComponent = __decorate(
  [
    Component({
      selector: "app-group-permission",
      templateUrl: "./group-permission.component.html",
      styleUrls: ["./group-permission.component.scss"]
    })
  ],
  GroupPermissionComponent
);
export { GroupPermissionComponent };
//# sourceMappingURL=group-permission.component.js.map
