import { Component, OnInit, ElementRef } from "@angular/core";
import { Util } from "src/app/utils/util";
import { CurrentUserService } from "src/app/services/current-user.service";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { PromotionsService } from "../../services/promotion.service";
import { UtilService } from "../../services/util.service";
import { ServiceTypeService } from "../../services/service-type.service";

import { RegisterPromotionModalComponentComponent } from "./register-promotion-modal-component/register-promotion-modal-component.component";
import { HelperService } from "src/app/services/helper.service";
import { PromotionFilterType } from "src/app/models/promotionFilter";
import { EnumTipoPromocao } from "src/app/models/tipoPromocao";

@Component({
  selector: "app-promotion",
  templateUrl: "./promotion.component.html",
  styleUrls: ["./promotion.component.scss"]
})
export class PromotionComponent implements OnInit {
  code: "";
  data = [];
  Estados = [];
  Municipio = [];
  totalRecords = 0;
  Bairro = [];
  situacaoDescricao = "";
  TipoServico = [];
  filtro: PromotionFilterType;
  filter: any;
  tipoValor = false;
  elementosComClickInserido = [];

  componentsList = [
    {
      name: "RegisterPromotionModalComponentComponent",
      component: RegisterPromotionModalComponentComponent
    }
  ];
  columns = [
    { field: "descricao", type: "text", name: "Título" },
    { field: "vigencia", type: "text", name: "Vigência" },
    { field: "tipoDescricao", type: "text", name: "Tipo" },
    { field: "valorMinimoCompra", name: "Valor Mínimo" },
    { field: "situacao", type: "ativarEditar", name: "Ações" }
  ];

  constructor(
    private util: Util,
    private promotionService: PromotionsService,
    private utilService: UtilService,
    private serviceTypeService: ServiceTypeService,

    private elementRef: ElementRef,
    private nbDialogService: NbDialogService,
    private nbToastrService: NbToastrService,
    private helperService: HelperService,
    public uService: CurrentUserService
  ) {}

  ngOnInit() {
    this.filtro = new PromotionFilterType();
    this.inicializeFiltroEmpty();
    this.filtro.situacao = "true";
    this.situacaoDescricao = this.filtro.situacao ? "Ativo" : "Desativado";
    this.filtro.tipoPromocao = EnumTipoPromocao.PercentualdeDesconto;
    const permissions = this.uService.getEnumPermissions();
    // this.columns = this.util.controlActionsTable(
    //   this.columns,
    //   permissions.CadastrarPromocao,
    //   permissions.AtualizarPromocao
    // );

    this.fetchTipoServico();
    this.fetchUF();
    this.searchValue();
  }

  validaValor(valor) {
    switch (valor) {
      case "dataFimVigencia":
        if (
          new Date(this.filtro.dataFimVigencia).getTime() <
          new Date(this.filtro.dataInicioVigencia).getTime()
        ) {
          this.filtro.dataFimVigencia = "";
          this.filtro.dataInicioVigencia = "";
          this.nbToastrService.warning(
            "Data fim da vigência deve ser maior que o data inicio da vigência.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "valorDescontoMinimo":
        if (parseInt(this.filtro.valorDescontoMinimo) < 0) {
          this.filtro.valorDescontoMinimo = "";
          this.nbToastrService.warning(
            "Campo valor de desconto mínimo dever ser maior que zero.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "valorDescontoMaximo":
        if (
          parseInt(this.filtro.valorDescontoMaximo) < 0 ||
          parseInt(this.filtro.valorDescontoMaximo) <
            parseInt(this.filtro.valorDescontoMinimo)
        ) {
          this.filtro.valorDescontoMaximo = "";
          this.nbToastrService.warning(
            "Campo valor de desconto máximo dever ser maior que o valor de desconto mínimo.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "percentualDescontoMinimo":
        if (parseInt(this.filtro.percentualDescontoMinimo) < 0) {
          this.filtro.percentualDescontoMinimo = "";
          this.nbToastrService.warning(
            "Campo percentual de desconto mínimo deve ser maior que zero.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "percentualDescontoMaximo":
        if (
          parseInt(this.filtro.percentualDescontoMaximo) < 0 ||
          parseInt(this.filtro.percentualDescontoMaximo) <
            parseInt(this.filtro.percentualDescontoMinimo)
        ) {
          this.filtro.percentualDescontoMaximo = "";
          this.nbToastrService.warning(
            "Campo percentual de desconto máximo deve ser maior que percentual desconto mínimo.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "valorMinimoCompraMinimo":
        if (parseInt(this.filtro.valorMinimoCompraMinimo) < 0) {
          this.filtro.valorMinimoCompraMinimo = "";
          this.nbToastrService.warning(
            "Campo valor mínimo de compra deve ser maior que zero.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
      case "valorMinimoCompraMaximo":
        if (
          parseInt(this.filtro.valorMinimoCompraMaximo) < 0 ||
          parseInt(this.filtro.valorMinimoCompraMaximo) <
            parseInt(this.filtro.valorMinimoCompraMinimo)
        ) {
          this.filtro.valorMinimoCompraMaximo = "";
          this.nbToastrService.warning(
            "Campo valor máximo de compra deve ser maior que o valor mínimo de compra.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
    }
  }

  changePage(selectedPage: number) {
    this.filtro.take = 10;
    this.filtro.offset = (selectedPage - 1) * 10;
    this.fetch(this.filtro);
  }
  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let count = 0;
      for (const item of this.data) {
        const element = allElements[count];
        let template = "";
        let id = "";
        if (element.getAttribute("eventName") == "Editar") {
          template = "RegisterPromotionModalComponentComponent";
        } else {
          template = element.getAttribute("template") || "";
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
        // }
        count += 1;
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
    const currentTemplate = this.componentsList.find(
      ({ name }) => name === template
    );
    const item = this.data.find(({ id }) => id === code);
    const ref = this.nbDialogService
      .open<any>(currentTemplate.component, {
        context: {
          data: item
        }
      })
      .onClose.subscribe(() => this.searchValue());
  }

  fetch(param) {
    this.promotionService.fetch(param).subscribe(res => {
      this.data = [];
      this.totalRecords = res["value"]["qtd"];
      res["value"]["data"].forEach(element => {
        element.titulo = element.descricao;
        element.situacaoDescricao = element.situacao ? "Ativo" : "Desativada";
        element.dataInicioVigencia = element.dataInicioVigencia.split("T")[0];
        element.dataFimVigencia = element.dataFimVigencia.split("T")[0];
        this.data.push(element);
      });

      this.addEvent();
    });
  }

  itemChanged(result: any, code: string) {
    this.inativarRegistro(code);
  }

  inativarRegistro(code: string) {
    let msg = "";
    this.promotionService.delete(code).subscribe(
      res => {
        this.data.forEach(element => {
          if (element.id == code) {
            if (element["situacao"]) msg = "Registro desativado com sucesso.";
            else msg = "Registro ativado com sucesso.";
          }
        });
        this.nbToastrService.success(msg, "Sucesso", {
          duration: 2000
        });
        this.changePage(0);
      },
      () => {
        this.nbToastrService.danger("Falha ao remover o registro", "Falha", {
          duration: 2000
        });
      }
    );
  }

  inicializeFiltroEmpty() {
    this.filtro.dataInicioVigencia = "";
    this.filtro.dataFimVigencia = "";
    this.filtro.titulo = "";
    this.filtro.situacao = "true";
    this.filtro.tipoPromocao = "PercentualdeDesconto";
    this.filtro.valorDescontoMinimo = "";
    this.filtro.valorDescontoMaximo = "";
    this.filtro.percentualDescontoMinimo = "";
    this.filtro.percentualDescontoMaximo = "";
    this.filtro.valorMinimoCompraMinimo = "";
    this.filtro.valorMinimoCompraMaximo = "";
    this.filtro.estado = "";
    this.filtro.municipio = "";
    this.filtro.bairro = "";
    this.filtro.codigoTipoServico = "";
    this.filtro.cNPJEstabelecimento = "";
    this.filtro.nomeEstabelecimento = "";
  }
  searchValue() {
    this.fetch(this.filtro);
  }
  newValue() {
    this.nbDialogService
      .open(RegisterPromotionModalComponentComponent, {
        context: { code: this.code }
      })
      .onClose.subscribe(() => {
        this.code;
        this.searchValue();
      });
  }

  fetchTipoServico() {
    this.serviceTypeService.fetchCombo().subscribe(({ value }) => {
      this.TipoServico = value.map(item => {
        return {
          ...item
        };
      });
    });
  }
  fetchUF() {
    this.utilService.UF().subscribe(({ value }) => {
      this.Estados = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  fetchMunicipios(code: string) {
    this.utilService.Municipio(code).subscribe(({ value }) => {
      this.Municipio = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  fetchBairros(code: string) {
    this.utilService.Bairro(code).subscribe(({ value }) => {
      this.Bairro = value.map(item => {
        return {
          ...item
        };
      });
    });
  }
}
