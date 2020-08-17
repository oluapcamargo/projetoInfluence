import { __awaiter, __decorate } from "tslib";
import { Component, Input } from "@angular/core";
import { RegisterUserModalComponent } from "src/app/pages/security/register-user/register-user-modal/register-user-modal.component";
import { RegisterGroupModalComponent } from "src/app/pages/security/register-group/register-group-modal/register-group-modal.component";
let DataTableComponent = class DataTableComponent {
  constructor(elementRef, dialogService, helperService, router) {
    this.elementRef = elementRef;
    this.dialogService = dialogService;
    this.helperService = helperService;
    this.router = router;
    this.dataAux = [];
    this.isOrdered = false;
    this.componentsList = [
      {
        name: "RegisterUserModalComponent",
        component: RegisterUserModalComponent
      },
      {
        name: "RegisterGroupModalComponent",
        component: RegisterGroupModalComponent
      }
    ]; // cant fucking change that
    this.searchObject = {};
    this.elementosComClickInserido = [];
  }
  ngOnInit() {
    this.configuraElementosTable();
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
                    this.delete(deleteEventName, id);
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
  search(searchText) {
    this.data = this.dataAux.filter(item => {
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
  order(column = "nome") {
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
  detail(template, code) {
    const currentTemplate = this.componentsList.find(
      ({ name }) => name === template
    );
    const item = this.data.find(({ id }) => id === code);
    const ref = this.dialogService.open(currentTemplate.component, {
      context: {
        data: item
      }
    });
    this.helperService.isModalToClose.asObservable().subscribe(res => {
      if (res) ref.close();
    });
  }
  edit(code, route) {
    return __awaiter(this, void 0, void 0, function*() {
      yield this.router.navigate([route], { queryParams: { code } });
    });
  }
  delete(eventName, code) {
    this.helperService.deleteItem(eventName, code);
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
};
__decorate([Input()], DataTableComponent.prototype, "data", void 0);
__decorate([Input()], DataTableComponent.prototype, "defaultColumns", void 0);
DataTableComponent = __decorate(
  [
    Component({
      selector: "app-data-table",
      templateUrl: "./data-table.component.html",
      styleUrls: ["./data-table.component.scss"]
    })
  ],
  DataTableComponent
);
export { DataTableComponent };
//# sourceMappingURL=data-table.component.js.map
