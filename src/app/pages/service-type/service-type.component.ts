import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CurrentUserService } from "src/app/services/current-user.service";
import { Util } from "src/app/utils/util";
import { ServiceTypeService } from "src/app/services/service-type.service";
import { RegisterServiceTypeModalComponent } from "./register-service-type-modal/register-service-type-modal.component";
import { HelperService } from "src/app/services/helper.service";
import { CategoriaService } from "src/app/services/categoria.service";
import { AppDecisionAlertComponent } from "src/app/components/app-decision-alert/app-decision-alert.component";
import { TipoServicoFilterType } from "src/app/models/tipoServicoFilter";
import { Subscription } from "rxjs";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: "app-service-type",
  templateUrl: "./service-type.component.html",
  styleUrls: ["./service-type.component.scss"],
  providers: [ServiceTypeService]
})
export class ServiceTypeComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  data = [];
  isFetching = false;
  isFiltering = false;
  code = "";
  categorias: any = [];
  situacaoDescricao = "";
  totalRecords = 0;
  elementosComClickInserido = [];
  filter: TipoServicoFilterType;
  permissions = this.uService.getEnumPermissions();

  componentsList = [
    {
      name: "RegisterServiceTypeModalComponent",
      component: RegisterServiceTypeModalComponent
    },
    {
      name: "AppDecisionAlertComponent",
      component: AppDecisionAlertComponent
    }
  ];

  columns = [
    { field: "nome", name: "Nome" },
    { field: "descricaoCategoria", name: "Categoria" },
    { field: "situacaoDescricao", name: "Situação" },
    { field: "situacao", type: "ativarTipoServico", name: "Ações" }
  ];

  constructor(
    private serviceTypeService: ServiceTypeService,
    private nbDialogService: NbDialogService,
    private nbToastrService: NbToastrService,
    public uService: CurrentUserService,
    private elementRef: ElementRef,
    private categoriaService: CategoriaService,
    private helperService: HelperService,
    private loadingService: LoadingBarService,
    private util: Util
  ) {}

  ngOnInit() {
    this.configLoading();
    const permissions = this.uService.getEnumPermissions();
    // this.columns = this.util.controlActionsTable(
    //   this.columns,
    //   permissions.CadastrarTipoServico,
    //   permissions.DeletarTipoServico
    // );
    this.filter = new TipoServicoFilterType();
    this.data = [];
    this.filter.situacao = "1";
    this.filter.categoriaCodigo = "";
    this.filter.nome = "";
    this.getCategorias();
    this.search();
  }

  configLoading() {
    this.subscriptions.add(
      this.loadingService.progress$.subscribe(value => {
        this.isFetching = value && value < 100;
      })
    );
  }

  handleFilter() {
    this.isFiltering = !this.isFiltering;
  }

  changePage(selectedPage: number) {
    this.filter.take = 10;
    this.filter.offset = (selectedPage - 1) * 10;
    this.search();
    this.filter.take = 10;
    this.filter.offset = 0;
  }

  search() {
    if (
      this.filter != undefined &&
      (this.filter.nome != undefined ||
        this.filter.categoriaCodigo != undefined ||
        this.filter.situacao != undefined)
    ) {
      this.serviceTypeService.fetch(this.filter).subscribe(res => {
        if (res["value"] != undefined) {
          this.totalRecords = res["value"]["qtd"];
          this.data = res["value"]["data"].map(item => {
            return {
              ...item,
              situacaoDescricao: item.situacao ? "Ativo" : "Inativo"
            };
          });
          this.addEvent();
        }
      });
    } else {
      this.nbToastrService.danger(
        "É necessário preencher algum filtro para busca.",
        "Falha",
        {
          duration: 3000
        }
      );
    }
  }

  clearFilter() {
    this.filter.nome = "";
    this.filter.categoriaCodigo = "";
    this.filter.situacao = "2";
    this.search();
  }

  isBigEnough(value) {
    return value >= 10;
  }

  filtrarElementos() {
    let lista = this.data;
    let listaAux = [];
    lista.forEach(element => {
      let addElemento = 0;
      if (
        this.filter != undefined &&
        this.filter.nome != undefined &&
        this.filter.nome != ""
      ) {
        if (
          (element.nome.toUpperCase() == this.filter.nome.toUpperCase() ||
            element.nome
              .toUpperCase()
              .indexOf(this.filter.nome.toUpperCase()) >= 0) &&
          addElemento != 2
        ) {
          addElemento = 1;
        } else {
          addElemento = 2;
        }
      }
      if (
        this.filter != undefined &&
        this.filter.categoriaCodigo != undefined &&
        this.filter.categoriaCodigo != ""
      ) {
        if (
          element.categoriaCodigo == this.filter.categoriaCodigo &&
          addElemento != 2
        ) {
          addElemento = 1;
        } else {
          addElemento = 2;
        }
      }
      if (
        this.filter != undefined &&
        this.filter.situacao != undefined &&
        this.filter.situacao != "" &&
        this.filter.situacao.length == 1
      ) {
        if (
          (element.situacao ? "Ativo" : "Inativo") ==
            (this.filter.situacao == "1" ? "Ativo" : "Inativo") &&
          this.filter.situacao != "0" &&
          addElemento != 2
        ) {
          addElemento = 1;
        } else if (this.filter.situacao == "0" && addElemento != 2) {
          addElemento = 1;
        } else {
          addElemento = 2;
        }
      }

      if (addElemento == 1) {
        listaAux.push(element);
      }
    });
    this.data = listaAux;
    listaAux = [];
    this.data.sort((a, b) =>
      a.nome > b.nome ? 1 : a.nome === b.nome ? 0 : -1
    );
  }

  getCategorias() {
    this.categoriaService.fetch().subscribe(({ value }) => {
      this.categorias = value.map(item => {
        return {
          name: item.descricao,
          codigo: item.id,
          ...item
        };
      });
    });
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let count = 0;
      for (const item of this.data) {
        for (let k = 0; k < 2; k++) {
          const element = allElements[count];

          let template = "";
          let id = "";
          if (element.getAttribute("eventName") == "Editar") {
            // if (
            //   !this.uService.validatePermissions(
            //     this.uService.getEnumPermissions().AtualizarTipoServico
            //   )
            // )
            element.style.visibility = "hidden";

            template = "RegisterServiceTypeModalComponent";
          } else {
            // if (
            //   !this.uService.validatePermissions(
            //     this.uService.getEnumPermissions().DeletarTipoServico
            //   )
            // )
            element.style.visibility = "hidden";

            template = "AppDecisionAlertComponent";
          }
          id = item.id;

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
          count += 1;
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
      let count = 0;

      for (const item of this.data) {
        // for (const element of allElements) {
        const element = allElements[count];
        // if (
        //   !this.uService.validatePermissions(
        //     this.uService.getEnumPermissions().InativarAtivarTipoServico
        //   )
        // )
        element.style.visibility = "hidden";

        if (!this.elementosComClickInserido.includes(element)) {
          element.addEventListener(
            "click",
            () => {
              this.inativarRegistro(item.id);
            },
            false
          );
          this.elementosComClickInserido.push(element);
        }
        // }
        count += 1;
      }
    }, 1000);
  }

  detail(template: any, code: string) {
    this.serviceTypeService.fetchId(code).subscribe(res => {
      // const item = this.data.find(({ id }) => id === code);
      const item = res.value;

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
          if (ret != undefined && ret == true) {
            const itemDeletado = this.data.find(({ id }) => id === code);
            itemDeletado.deletado = true;
            this.serviceTypeService.update(itemDeletado).subscribe(
              res => {
                let mensagem = "";
                if (res) {
                  mensagem = "Registro deletado com sucesso.";
                } else {
                  mensagem = "Registro não deletado.";
                }

                this.nbToastrService.success(mensagem, "Sucesso", {
                  duration: 2000
                });
                this.ngOnInit();
              },
              () => {
                this.nbToastrService.danger(
                  "Falha ao remover o registro",
                  "Falha",
                  {
                    duration: 2000
                  }
                );
              }
            );
          }
          this.ngOnInit();
        });
    });
  }

  // fetch() {
  //   this.serviceTypeService.fetch(this.filter).subscribe(({ value }) => {
  //     this.data = value.map(item => {
  //       return {
  //         ...item,
  //         situacaoDescricao: item.situacao ? "Ativo" : "Inativo"
  //       };
  //     });
  //     this.filtrarElementos();
  //     this.addEvent();
  //   });
  // }

  itemChanged(result: any, code: string) {
    this.inativarRegistro(code);
  }

  inativarRegistro(code: string) {
    let idDeletado = code;
    let mensagem = "Registro desativado com sucesso.";
    this.serviceTypeService.delete(code).subscribe(
      res => {
        this.data.forEach(element => {
          if (element.id == idDeletado) {
            if (element.situacaoDescricao == "Inativo")
              mensagem = "Registro ativado com sucesso.";
          }
        });
        this.nbToastrService.success(mensagem, "Sucesso", {
          duration: 2000
        });
        this.ngOnInit();
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
      .open(RegisterServiceTypeModalComponent, {
        context: { code: this.code }
      })
      .onClose.subscribe(code => {
        this.filter.situacao = "1";
        this.ngOnInit();
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
