import { Component, OnInit, ElementRef } from "@angular/core";
import { Util } from "src/app/utils/util";
import { GroupService } from "src/app/services/group.service";
import { CompanyService } from "src/app/services/company.service";
import { DomainService } from "src/app/services/domain.service";
import { NbToastrService } from "@nebular/theme";
import { CurrentUserService } from "src/app/services/current-user.service";
import { isThisSecond } from "date-fns";

@Component({
  selector: "app-group-permission",
  templateUrl: "./group-permission.component.html",
  styleUrls: ["./group-permission.component.scss"]
})
export class GroupPermissionComponent implements OnInit {
  companies = [];
  groups = [];
  data = {
    grupoId: "",
    permissaoId: ""
  };
  dataFilter = {
    take: 100,
    offset: 0
  };
  permissoesGrupo = [];
  permissions = [];
  permissionsAdded = [];
  permissionsToAdd;
  filter = {
    selectedCompany: "0",
    selectedGroup: "0"
  };

  public PermissionsToAddTemp = [];
  public PermissionsAddedTemp = [];
  checkRemove = false;
  checkAdd = false;

  constructor(
    private groupService: GroupService,
    private companyService: CompanyService,
    private domainService: DomainService,
    public uService: CurrentUserService,
    private nbToastrService: NbToastrService
  ) {}

  ngOnInit() {
    // this.fetchCompany()
    this.fetchGroups();
    this.fetchPermissions();
  }

  fetchGroups() {
    this.groupService.fetchGrupos(this.dataFilter).subscribe(({ value }) => {
      this.groups = value.data;
    });
  }

  fetchCompany() {
    //this.companyService.fetch().subscribe(({ value }) => {
    // this.companies = value
    //})
  }

  hasTooltip() {
    const tooltip = document.querySelectorAll(
      "div.cdk-overlay-container > div.cdk-overlay-connected-position-bounding-box"
    );
    tooltip[0].remove();
  }

  addPermissionAdded(item) {
    this.removePermission(item);
    this.save(item);
  }

  addPermissionBack(item) {
    delete item.check;
    if (!this.permissions.find(element => element.id == item.id))
      this.permissions.push(item);
  }

  removePermissionAdded(permission) {
    let code: any;
    this.permissoesGrupo.forEach(element => {
      if (element.permissaoId == permission.id) code = element.id;
    });
    if (code != undefined) {
      this.groupService.deletePermission(code).subscribe(() => {
        this.permissionsAdded = this.permissionsAdded.filter(
          item => item.id !== permission.id
        );

        this.showSuccess();
        this.PermissionsAddedTemp = [];
        this.checkRemove = false;
        this.hasTooltip();
      });
    }
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

  fetchPermissions() {
    this.domainService.fetchPermissions().subscribe(({ value }) => {
      this.permissions = [];

      value.forEach(item => {
        if (item.permissaoOrdem != 0) this.permissions.push(item);
      });
    });
  }

  // sortBy(prop: string) {
  //   return this.permissions.sort((a, b) =>
  //     a.permissaoOrdem > b.permissaoOrdem
  //       ? 1
  //       : a.permissaoOrdem === b.permissaoOrdem
  //       ? 0
  //       : -1
  //   );
  // }

  fetchGroupPermissions(event) {
    if (event != null && event.length > 0) {
      this.fetchPermissions();
      this.filter.selectedGroup = event;
      this.groupService.fetchGroupPermissions(event).subscribe(
        ({ value }) => {
          this.permissionsAdded = [];

          value.forEach(item => {
            if (item.permissaoOrdem != 0) this.permissionsAdded.push(item);
          });
          let listPermissao = this.permissions;
          listPermissao.forEach(item => {
            this.permissionsAdded.forEach(({ id }) => {
              if (item.id === id) {
                this.removePermission({ id });
              }
            });
          });
          this.permissions.sort((a, b) =>
            a.permissaoOrdem > b.permissaoOrdem
              ? 1
              : a.permissaoOrdem === b.permissaoOrdem
              ? 0
              : -1
          );
        },
        err => {
          this.permissions = [];
          this.permissionsAdded = [];
        }
      );
    }
    this.loadPermissaoGrupo(event);
  }

  loadPermissaoGrupo(event) {
    this.groupService.fetchPermissions(event).subscribe(({ value }) => {
      this.permissoesGrupo = value.value;
      let listPermissao = this.permissions;
      listPermissao.forEach(item => {
        this.permissionsAdded.forEach(({ id }) => {
          if (item.id === id) {
            this.removePermission({ id });
          }
        });
      });
    });
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

  setFilterGroup(value, event) {
    this.filter.selectedGroup = value;
    this.fetchGroupPermissions(this.filter.selectedGroup);
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
}
