import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { Util } from "src/app/utils/util";
import { CurrentUserService } from "src/app/services/current-user.service";
import { NbDialogService } from "@nebular/theme";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { StoreService } from "../../services/store.service";
import { UtilService } from "../../services/util.service";
import { PromotionType } from "../../models/promotion";
import { UserService } from "src/app/services/user.service";
import { ServiceTypeService } from "../../services/service-type.service";
import { HelperService } from "src/app/services/helper.service";
import { StoreModalComponent } from "./store-modal/store-modal.component";
import { AppComponent } from "../../app.component";
import { StoreType } from "src/app/models/store";
import { FilterStore } from "src/app/models/filtersstore";
import { AppDecisionAlertComponent } from "src/app/components/app-decision-alert/app-decision-alert.component";
import { ItemNgSelect } from "src/app/models/ngSelect";
import { AlertService } from "src/app/services/alert.service";
import { Subscription } from "rxjs";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.scss"]
})
export class StoreComponent implements OnInit, OnDestroy {
  // <nb-option value="1">Aguardando avaliação</nb-option>
  // <nb-option value="2">Ativo</nb-option>
  // <nb-option value="3">Inativo</nb-option>
  // <nb-option value="4">Reprovado</nb-option>
  subscriptions = new Subscription();

  permissions = this.uService.getEnumPermissions();
  data = [];
  code: {};
  bairro: {};
  Estados = [];
  tipoServico: any[];
  filtro: FilterStore;
  Municipio = [];
  isFiltering = false;
  isFetching = false;
  totalRecords = 0;
  Bairro = [];
  columns = [
    { field: "nome", name: "Nome" },
    { field: "documento", name: "Documento" },
    { field: "email", name: "Email" },
    { field: "telefone", name: "Telefone" },
    {
      field: "situacaoNumerica",
      type: "ativarEditarEstabelecimentos",
      name: "Ações"
    }
  ];

  elementosComClickInserido = [];
  componentsList = [
    {
      name: "StoreModalComponent",
      component: StoreModalComponent
    },
    {
      name: "AppDecisionAlertComponent",
      component: AppDecisionAlertComponent
    }
  ];

  constructor(
    private util: Util,
    private utilService: UtilService,
    private serviceTypeService: ServiceTypeService,
    private storeService: StoreService,
    private elementRef: ElementRef,
    private userService: UserService,
    private nbDialogService: NbDialogService,
    private nbToastrService: NbToastrService,
    private helperService: HelperService,
    public uService: CurrentUserService,
    private loadingService: LoadingBarService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.data = [];
    this.clearFilter();
    this.configLoading();

    // const permissions = this.uService.getEnumPermissions();
    // this.columns = this.util.controlActionsTable(
    //   this.columns,
    //   permissions.CadastrarEstabelecimento,
    //   permissions.AtualizarEstabelecimento
    // );

    // this.fetch();
    // this.fetchUF();
    // this.getTipoServico();
  }

  configLoading() {
    this.subscriptions.add(
      this.loadingService.progress$.subscribe(value => {
        this.isFetching = value && value < 100;
      })
    );
  }

  clearFilter() {
    this.filtro = new FilterStore();
    this.filtro.email = null;
    this.filtro.nome = null;
    this.filtro.telefone = "";
  }

  handleFilter() {
    this.isFiltering = !this.isFiltering;
  }

  search() {
    if (this.filtro != undefined && this.filtro != null) {
      var lista = [];
      var listaAux = [];
      // 1 - Aguardando avaliação 2 - Ativo 3 - Inativo 4 - Reprovado
      this.storeService.fetchTable(this.filtro).subscribe(res => {
        if (res["value"] != undefined) {
          this.totalRecords = res["value"].length;
          this.data = res["value"].map(item => {
            return {
              ...item,
              telefone: item.phoneNumber,
              email: item.userName
            };
          });
        }
        this.addEvent();
      });
    }
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let elementCount = 0;
      if (allElements.length > 0) {
        for (const item of this.data) {
          let store = new StoreType();
          store = item;
          let stop =
            store["situacaoNumerica"] == 1
              ? 3
              : store["situacaoNumerica"] == 2
              ? 1
              : store["situacaoNumerica"] == 3
              ? 1
              : 2;
          for (let count = 0; count < stop; count++) {
            const element = allElements[elementCount];
            let template = "";
            let id = item.id;
            if (element.getAttribute("eventName") == "Editar") {
              template = "StoreModalComponent";
            } else if (
              element.getAttribute("eventName") == "block" ||
              element.getAttribute("eventName") == "check"
            ) {
              template =
                "AppDecisionAlertComponent" +
                "-" +
                element.getAttribute("eventName");
            }

            if (!this.elementosComClickInserido.includes(element)) {
              element.addEventListener(
                "click",
                () => {
                  template != "" ? this.detail(template, id) : "";
                },
                false
              );
              this.elementosComClickInserido.push(element);
            }
            elementCount += 1;
          }
        }
      }
    }, 1000);
    this.addEventInativar();
  }

  addEventInativar() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "ui-switch"
      );

      if (allElements.length > 0) {
        let count = 0;

        for (const item of this.data) {
          const element = allElements[count];
          if (element != null) {
            if (!this.elementosComClickInserido.includes(element)) {
              element.addEventListener(
                "click",
                () => {
                  this.inativarRegistro(item);
                },
                false
              );
              this.elementosComClickInserido.push(element);
            }
            // }
            count += 1;
          }
        }
      }
    }, 1000);
  }

  getEstabelecimentoEdicao(code) {
    let dataAux;
    this.storeService.fetchByEstabId(code).subscribe(res => {
      dataAux = res;
    });
    return dataAux;
  }

  detail(template: any, code: string) {
    // const item = this.getEstabelecimentoEdicao(code);
    const item = new StoreType();
    this.storeService.fetchByEstabId(code).subscribe(res => {
      // const item = this.data.find(({ id }) => id === code);
      const item = res.value;
      if (String(template).indexOf("AppDecisionAlertComponent") >= 0) {
        item.tipoAcao = template.split("-")[1];
        template = template.split("-")[0];
      }

      const currentTemplate = this.componentsList.find(
        ({ name }) => name === template
      );
      const ref = this.nbDialogService
        .open<any>(currentTemplate.component, {
          context: {
            data: item
          }
        })
        .onClose.subscribe(ret => {
          if (ret != false) {
            if (template == "AppDecisionAlertComponent") {
              this.updateSituacaoEstabelecimento(code, ret);
            }
          }
        });
    });
  }

  changePage(selectedPage: number) {
    this.filtro.pageSize = 10;
    this.filtro.pageNumber = (selectedPage - 1) * 10;
    this.search();
  }

  updateSituacaoEstabelecimento(code: string, ret: any) {
    let estabelecimento = {
      codigoUsuarioAprovacaoReprovacao: this.uService.id,
      observacaoAprovacaoReprovacao: ret[1],
      situacao: ret[0] == "Aprovar" ? 2 : 4
    };
    this.storeService.updateSituacao(code, estabelecimento).subscribe(res => {
      let msg =
        ret[0] == "Aprovar"
          ? "Estabelecimento aprovado com sucesso."
          : "Estabelecimento reprovado com sucesso.";
      this.nbToastrService.success(msg, "Sucesso", {
        duration: 2000
      });
      this.fetch();
    });
  }

  fetch() {
    this.storeService.fetchTable(this.filtro).subscribe(res => {
      if (res["value"] != undefined) {
        this.totalRecords = res["value"]["qtd"];
        this.data = res["value"]["data"].map(item => {
          return {
            ...item,
            bairro: item.bairro.nome,
            situacao:
              item.situacao == 1
                ? "Aguardando avaliação"
                : item.situacao == 2
                ? "Ativo"
                : item.situacao == 3
                ? "Inativo"
                : "Reprovado",
            situacaoNumerica: item.situacao,
            situacaoDescricao: item.situacao ? "Ativo" : "Inativo"
          };
        });
      }
      this.addEvent();
    });
  }

  itemChanged(result: any, code: string) {
    if (result) {
      this.inativarRegistro(code);
      console.log("Yes clicked ->" + result);
    } else {
      console.log("Cancel clicked");
    }
  }

  inativarRegistro(item) {
    this.storeService.delete(item.id).subscribe(
      res => {
        let msg = "Registro desativado com sucesso";
        if (item.situacaoNumerica == 3) {
          msg = "Registro ativado com sucesso";
        }
        this.nbToastrService.success(msg, "Sucesso", {
          duration: 2000
        });
        this.fetch();
      },
      () => {
        this.nbToastrService.danger("Falha ao remover o registro", "Falha", {
          duration: 2000
        });
      }
    );
  }

  newValue() {
    this.nbDialogService
      .open(StoreModalComponent, {
        context: { code: this.code }
      })
      .onClose.subscribe(() => this.code);
    this.fetch();
  }

  fetchUF() {
    this.utilService.UF().subscribe(({ value }) => {
      this.Estados = value.map(item => {
        return {
          ...item
        };
      });
      this.Municipio = [];
      this.Bairro = [];
    });
  }

  // fetchMunicipios() {
  //   if (this.filtro.estado) {
  //     this.utilService.Municipio(this.filtro.estado).subscribe(({ value }) => {
  //       this.Municipio = value;
  //       this.Bairro = [];
  //       this.alert.success("Lista de municípios carregada com sucesso");
  //     });
  //   }

  //   this.filtro.municipio = null;
  //   this.filtro.bairro = null;
  // }

  // fetchBairros() {
  //   if (this.filtro.municipio) {
  //     this.utilService.Bairro(this.filtro.municipio).subscribe(({ value }) => {
  //       this.Bairro = value;
  //       this.alert.success("Lista de bairros carregada com sucesso");
  //     });
  //   }

  //   this.filtro.bairro = null;
  // }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
