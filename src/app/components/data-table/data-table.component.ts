import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { HelperService } from "src/app/services/helper.service";
import { Router } from "@angular/router";
import { RegisterUserModalComponent } from "src/app/pages/security/register-user/register-user-modal/register-user-modal.component";
import { RegisterGroupModalComponent } from "src/app/pages/security/register-group/register-group-modal/register-group-modal.component";
import { RegisterServiceTypeModalComponent } from "src/app/pages/service-type/register-service-type-modal/register-service-type-modal.component";
import { AppDecisionAlertComponent } from "src/app/components/app-decision-alert/app-decision-alert.component";
import { RegisterUserComponent } from "src/app/pages/security/register-user/register-user.component";
import { RegisterGroupComponent } from "src/app/pages/security/register-group/register-group.component";
import { PromotionComponent } from "src/app/pages/promotion/promotion.component";
import { ServiceTypeComponent } from "src/app/pages/service-type/service-type.component";
import { StoreModalComponent } from "src/app/pages/store/store-modal/store-modal.component";
import { StoreComponent } from "src/app/pages/store/store.component";
import { TabTipoServicoComponent } from "./../tab-tipo-servico/tab-tipo-servico.component";

import { UserDataComponent } from "src/app/pages/security/user-data/user-data.component";
import { UserPermissionComponent } from "src/app/pages/security/user-permission/user-permission.component";
import { AppChangePasswordComponent } from "src/app/pages/security/register-user/app-change-password/app-change-password.component";
import { range, sortBy, uniq } from "lodash";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
  providers: [
    RegisterUserComponent,
    RegisterGroupComponent,
    PromotionComponent,
    ServiceTypeComponent,
    UserDataComponent,
    UserPermissionComponent,
    StoreComponent,
    StoreModalComponent,
    TabTipoServicoComponent
  ]
})
export class DataTableComponent implements OnInit {
  code;
  enabled = false;
  @Input() data: any[];
  @Input() defaultColumns: any[];
  searchText: string;
  dataAux = [];
  isOrdered = false;
  @Input() totalRecords;

  @Output() pageChanged = new EventEmitter();
  rowsPerPage: number = 10;
  totalPages: number;
  selectedPage: number = 1;
  showDefaultPagination: boolean = false;
  readyPages: number[] = [];
  componentsList = [
    {
      name: "RegisterUserModalComponent",
      component: RegisterUserModalComponent
    },
    {
      name: "RegisterGroupModalComponent",
      component: RegisterGroupModalComponent
    },
    {
      name: "AppDecisionAlertComponent",
      component: AppDecisionAlertComponent
    },
    {
      name: "RegisterServiceTypeModalComponent",
      component: RegisterServiceTypeModalComponent
    },
    {
      name: "AppChangePasswordComponent",
      component: AppChangePasswordComponent
    },
    {
      name: "StoreModalComponent",
      component: StoreModalComponent
    }
  ]; // cant fucking change that
  searchObject = {};
  elementosComClickInserido = [];
  constructor(
    private elementRef: ElementRef,
    private dialogService: NbDialogService,
    private helperService: HelperService,
    private regUserComponent: RegisterUserComponent,
    private registerGroupComponent: RegisterGroupComponent,
    private serviceTypeComponent: ServiceTypeComponent,
    private userDataComponent: UserDataComponent,
    private promotionComponent: PromotionComponent,
    private storeComponent: StoreComponent,
    private tabTipoServicoComponent: TabTipoServicoComponent,

    private router: Router
  ) {}

  ngOnInit() {
    this.configuraElementosTable();
    if (this.totalRecords > 0) {
      this.totalPages = Math.ceil(this.totalRecords / this.rowsPerPage);
    }
  }

  ngOnChanges() {
    this.configuraElementosTable();
  }

  configuraElementosTable() {
    if (this.data) {
      this.dataAux = Object.create(this.data);
      setTimeout(() => {
        const allElements = this.elementRef.nativeElement.getElementsByTagName(
          "a"
        );

        for (const element of allElements) {
          const action = element.getAttribute("action");
          const template = element.getAttribute("template") || "";

          const id = element.getAttribute("code");
          const route = element.getAttribute("route") || "";
          const deleteEventName = element.getAttribute("eventName") || "";

          switch (action) {
            case "detail":
              if (!this.elementosComClickInserido.includes(element)) {
                element.addEventListener(
                  "click",
                  () => {
                    this.detail(template, id);
                  },
                  false
                );
                this.elementosComClickInserido.push(element);
              }
              break;

            case "edit":
              if (!this.elementosComClickInserido.includes(element)) {
                element.addEventListener(
                  "click",
                  () => {
                    this.edit(id, route);
                  },
                  false
                );
                this.elementosComClickInserido.push(element);
              }
              break;

            case "delete":
              if (!this.elementosComClickInserido.includes(element)) {
                element.addEventListener(
                  "click",
                  () => {
                    this.delete(template, deleteEventName, id);
                  },
                  false
                );
                this.elementosComClickInserido.push(element);
              }

              break;
            default:
              break;
          }
        }
      }, 1000);
    }
  }

  setRowsPerPage(value: number) {
    this.setPagination();
    // this.reRenderDatatable();
  }

  setPagination() {
    if (this.totalRecords && this.rowsPerPage) {
      this.totalPages = Math.ceil(this.totalRecords / this.rowsPerPage);
      this.showDefaultPagination = false;
      this.getNumberPages();
    } else if (this.totalRecords === 0 || this.rowsPerPage === 0) {
      this.showDefaultPagination = true;
    } else {
      this.showDefaultPagination = true;
      console.error(
        "totalRecords ou rowsPerPage são nulos em datatable.component.ts. A paginação default foi exibida."
      );
    }
  }

  getNumberPages() {
    this.readyPages =
      this.selectedPage + 4 > this.totalPages
        ? range(this.totalPages - 4, this.totalPages + 1)
        : range(this.selectedPage, this.selectedPage + 4);

    if (this.selectedPage !== 1 && this.selectedPage !== this.totalPages) {
      this.readyPages.unshift(this.selectedPage - 1);
    }

    this.readyPages = this.readyPages.filter(item => item > 0);
    this.readyPages = sortBy(uniq(this.readyPages), value => value);
    return this.readyPages;
  }

  emitPageChange(selectedPage: number) {
    this.selectedPage = selectedPage;
    this.getNumberPages();
    this.pageChanged.emit(selectedPage);
  }

  search(searchText: string) {
    this.data = this.dataAux.filter((item: any) => {
      for (const { field } of this.defaultColumns) {
        if (field !== "actions" && field !== "id") {
          const isFound = item[field]
            ? item[field]
                .toString()
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            : false;

          if (isFound) return true;
        }
      }
    });
  }

  order(column: string = "nome") {
    this.data = this.dataAux.sort((a, b) => {
      const first =
        a[column] != undefined
          ? a[column] && typeof a[column] === "number"
            ? a[column]
            : typeof a[column] === "number"
            ? a[column]
            : a[column].toLowerCase()
          : 0;
      const next =
        b[column] != undefined
          ? b[column] && typeof b[column] === "number"
            ? b[column]
            : typeof b[column] === "number"
            ? b[column]
            : b[column].toLowerCase()
          : 0;

      if (!this.isOrdered) {
        return first > next ? 1 : -1;
      } else {
        return first < next ? 1 : -1;
      }
    });
    this.isOrdered = !this.isOrdered;
  }

  detail(template: any, code: string) {
    const currentTemplate = this.componentsList.find(
      ({ name }) => name === template
    );
    const item = this.data.find(({ id }) => id === code);
    const ref = this.dialogService.open<any>(currentTemplate.component, {
      context: {
        data: item
      }
    });

    this.helperService.isModalToClose.asObservable().subscribe(res => {
      if (res) ref.close();
    });
  }

  async edit(code: string, route: string) {
    await this.router.navigate([route], { queryParams: { code } });
  }

  delete(template: any, eventName: string, code: string) {
    this.helperService.deleteItem(eventName, code);
    const currentTemplate = this.componentsList.find(
      ({ name }) => name === template
    );
    const refa = this.dialogService
      .open<any>(currentTemplate.component, {
        context: {
          data: code,
          eventName: eventName
        }
      })
      .onClose.subscribe(result => {
        if (
          eventName.toUpperCase() == "DELETARUSUARIO" ||
          eventName.toUpperCase() == "ATIVARUSUARIO"
        ) {
          this.regUserComponent.itemChanged(result, code);
        }
        if (
          eventName.toUpperCase() == "DELETARGRUPO" ||
          eventName.toUpperCase() == "ATIVARGRUPO"
        ) {
          this.registerGroupComponent.itemChanged(result, code);
        }
      });
  }

  download({ id, urlAnexo, downloadRoute = "" }) {
    if (downloadRoute !== "") {
      this.helperService.download(downloadRoute).subscribe(
        res => {
          const fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        },
        err => {}
      );
    }
  }
}
