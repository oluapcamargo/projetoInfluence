import { Component, OnInit } from "@angular/core";
import { PromotionType } from "src/app/models/promotion";
import { FilterStorePromotion } from "src/app/models/filterStorePromotion";
import { PromotionsService } from "src/app/services/promotion.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { UtilService } from "../../../services/util.service";

import { PromotionModule } from "./../promotion.module";
import { filterCustomerPromotion } from "src/app/models/filterCustomerPromotion";
@Component({
  selector: "app-register-promotion-modal-component",
  templateUrl: "./register-promotion-modal-component.component.html",
  styleUrls: ["./register-promotion-modal-component.component.scss"]
})
export class RegisterPromotionModalComponentComponent implements OnInit {
  data: PromotionType = new PromotionType();
  tipoPromocao: any;
  checkRemove = false;
  checkAdd = false;
  Estabelecimentos = [];
  EstabelecimentoToAddTemp = [];
  dataCustomer = new filterCustomerPromotion();
  estabelecimentos: [];
  valorTotalArrecadadoCupom = "";
  estabelecimentosListados: [];
  validTitulo = true;
  validVigencia = true;
  validTipo = true;
  Municipio = [];
  Estados = [];
  validValor = true;
  validDescSubTitulo = true;
  validPercentualDesconto = true;
  validValorMinimo = true;
  validQtdMaxima = true;
  filtroTabStoreInput = [];
  filtroTabServiceInput = [];
  filtroTabServiceModal = [];
  filtroTabStoreModal = [];
  tipo = false;

  estabelecimentosAdd: [];
  filter: FilterStorePromotion = new FilterStorePromotion();
  TipoPromocao = [
    {
      id: 0,
      name: "Valor"
    },
    {
      id: 1,
      name: "Percentual de Desconto"
    }
  ];

  code: {};
  constructor(
    private promotionsService: PromotionsService,
    private nbToastrService: NbToastrService,
    private utilService: UtilService,
    private nbDialogRef: NbDialogRef<RegisterPromotionModalComponentComponent>
  ) {}

  ngOnInit() {
    this.dataCustomer = new filterCustomerPromotion();
    this.filtroTabStoreModal = [];
    this.filtroTabStoreInput = [];
    this.filtroTabServiceModal = [];
    this.filtroTabServiceInput = [];
    if (this.data.id != null) {
      this.filtroTabStoreInput = this.data.estabelecimentos;
      this.filtroTabServiceInput = this.data.tipoServicos;
      this.data.situacaoString = this.data.situacao ? "Ativo" : "Inativo";
      this.valorTotalArrecadadoCupom =
        "R$" + this.data.valorTotalArrecadadoCupom;
      // this.data.situacao = (this.data.situacao? "Ativo" : "Desativado");
    } else {
      this.valorTotalArrecadadoCupom = "R$0,00";
    }
    this.fetchUF();
  }
  eventTabStore(event) {
    this.filtroTabStoreModal = [];
    this.filtroTabStoreModal.push(event);
  }
  eventTabService(event) {
    this.filtroTabServiceModal = [];
    this.filtroTabServiceModal.push(event);
  }
  PermissionsToAddAll(event) {
    this.checkAdd = event;
    this.changeValueInArrays(
      event,
      this.estabelecimentos,
      this.estabelecimentosAdd
    );

    if (!event) {
      this.estabelecimentosAdd = [];
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
  tipoPromocaoOnChange(event) {
    if (event == 0) {
      this.tipo = false;
      this.data.percentualDesconto = 0;
    } else {
      this.tipo = true;
      this.data.valor = 0;
    }
  }
  validaValor(valor) {
    switch (valor) {
      case "dataFimVigencia":
        if (
          new Date(this.data.dataFimVigencia).getTime() <
          new Date(this.data.dataInicioVigencia).getTime()
        ) {
          this.nbToastrService.warning(
            "Data fim da vigência deve ser maior que o data inicio da vigência.",
            "Atenção",
            {
              duration: 3000
            }
          );
        }
        break;
    }
  }
  validaDadosParaCadastros() {
    let erroEncontrado = false;
    let msgError = "";
    if (
      this.data.descricao == undefined ||
      this.data.descricao == null ||
      this.data.descricao == ""
    ) {
      this.validTitulo = false;
      erroEncontrado = true;
      msgError += "É necessário o cadastro de título para a promoção. ";
    } else {
      this.validTitulo = true;
    }
    if (
      this.data.descricaoSubtitulo == undefined ||
      this.data.descricaoSubtitulo == null
    ) {
      erroEncontrado = true;
      this.validDescSubTitulo = false;
    } else {
      this.validDescSubTitulo = true;
    }
    if (
      this.data.valorMinimoCompra == undefined ||
      this.data.valorMinimoCompra == null
    ) {
      erroEncontrado = true;
      this.validValorMinimo = false;
      msgError +=
        "É necessário preencher o valor mínimo de compras para utilização do cupom. ";
    } else {
      this.validValorMinimo = true;
    }
    if (
      this.data.quantidadeMaximaCupons == undefined ||
      this.data.quantidadeMaximaCupons == null
    ) {
      erroEncontrado = true;
      this.validQtdMaxima = false;
      msgError +=
        "É necessário preencher a quantidade mínima de compras para utilização do cupom. ";
    } else {
      this.validQtdMaxima = true;
    }

    if (
      this.data.dataInicioVigencia == undefined ||
      this.data.dataInicioVigencia == null ||
      this.data.dataFimVigencia == undefined ||
      this.data.dataFimVigencia == null ||
      new Date(this.data.dataInicioVigencia) < new Date()
    ) {
      this.validVigencia = false;
      erroEncontrado = true;
      msgError +=
        "É necessário o cadastro de vigência " +
        (this.data.dataInicioVigencia == undefined ||
        this.data.dataInicioVigencia == null
          ? "(Data Inicio da vigência) "
          : "") +
        (this.data.dataFimVigencia == undefined ||
        this.data.dataFimVigencia == null
          ? "(Data fim da Vigência)"
          : "") +
        " para a promoção. ";

      msgError +=
        new Date(this.data.dataInicioVigencia) < new Date()
          ? "Data Inicio da vigência não pode estar no passado."
          : "";
    } else {
      this.validVigencia = true;
    }
    if (this.data.tipo == undefined || this.data.tipo == null) {
      this.validTipo = false;
      erroEncontrado = true;
      msgError += "É necessário selecionar o tipo de promoção. ";
    } else {
      this.validTipo = true;
    }
    if (
      (this.data.valor == undefined || this.data.valor == null) &&
      !this.data.tipo
    ) {
      this.validValor = false;
      erroEncontrado = true;
      msgError += "É necessário preencher o valor da promoção. ";
    } else {
      this.validValor = true;
    }
    if (
      (this.data.percentualDesconto == undefined ||
        this.data.percentualDesconto == null) &&
      this.data.tipo
    ) {
      this.validPercentualDesconto = false;
      erroEncontrado = true;
      msgError +=
        "É necessário preencher o percentual de desconto da promoção. ";
    } else {
      this.validPercentualDesconto = true;
    }
    if (erroEncontrado)
      this.nbToastrService.warning(msgError, "Atenção", {
        duration: 2000
      });

    return !erroEncontrado;
  }
  fetchGroups(event) {}
  close() {
    this.data = null;
    this.nbDialogRef.close();
  }

  flagTodosClientes() {
    if (
      this.data.quantidadeMinimaDiasSemCompra > 0 &&
      this.data.quantidadeMaximaDiasSemCompra
    )
      return false;
    if (
      this.data.numeroMinimoComprasRealizadas > 0 &&
      this.data.numeroMaximoComprasRealizadas
    )
      return false;
    if (this.data.idadeMinima > 0 && this.data.idadeMaxima) return false;
    if (this.data.estadoId != null || this.data.municipioId != null)
      return false;

    return true;
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
  save() {
    if (this.filtroTabStoreModal[0] != undefined) {
      this.data.estabelecimentos = [];
      for (let k = 0; k < this.filtroTabStoreModal[0].length; k++) {
        this.data.estabelecimentos.push(this.filtroTabStoreModal[0][k].id);
      }
    }
    if (
      this.filtroTabServiceModal[0] != undefined &&
      this.filtroTabServiceModal[0].length > 0
    ) {
      this.data.tipoServicos = [];
      for (let k = 0; k < this.filtroTabServiceModal[0].length; k++) {
        this.data.tipoServicos.push(this.filtroTabServiceModal[0][k].id);
      }
    }

    if (this.validaDadosParaCadastros()) {
      this.data.municipioId =
        this.data.municipioId == "" ? null : this.data.municipioId;
      this.data.flagTodosCliente = this.flagTodosClientes();
      if (this.data.id) {
        if (
          this.data.estabelecimentos != undefined &&
          this.data.estabelecimentos != null &&
          this.data.estabelecimentos.length > 0
        ) {
          let aux = this.data.estabelecimentos;
          this.data.estabelecimentos = [];
          aux.forEach(element => {
            this.data.estabelecimentos.push(element["id"].toString());
          });
        }
        if (
          this.data.tipoServicos != undefined &&
          this.data.tipoServicos != null &&
          this.data.tipoServicos.length > 0
        ) {
          let aux = this.data.tipoServicos;
          this.data.tipoServicos = [];
          aux.forEach(element => {
            this.data.tipoServicos.push(element["id"].toString());
          });
        }
        this.promotionsService.update(this.data).subscribe(res => {
          if (res.hasSuccess) {
            this.nbToastrService.success(
              "Registro salvo com sucesso",
              "Sucesso",
              {
                duration: 2000
              }
            );
            this.close();
          } else {
            this.nbToastrService.warning(res.errors[0], "Falha", {
              duration: 3000
            });
          }
        });
      } else {
        this.promotionsService.save(this.data).subscribe(res => {
          if (res.hasSuccess) {
            this.nbToastrService.success(
              "Registro salvo com sucesso",
              "Sucesso",
              {
                duration: 2000
              }
            );
            this.close();
          } else {
            this.nbToastrService.warning(res.errors[0], "Falha", {
              duration: 3000
            });
          }
        });
      }
    }
  }
  fetchUF() {
    this.utilService.UF().subscribe(({ value }) => {
      this.Estados = value.map(item => {
        return {
          ...item
        };
      });
      this.Municipio = [];
    });
  }
  fetchMunicipios(code: string) {
    if (this.data.municipioId != undefined && this.data.municipioId != "")
      this.data.municipioId = "";
    this.utilService.Municipio(code).subscribe(({ value }) => {
      this.Municipio = value.map(item => {
        return {
          ...item
        };
      });
    });
  }
}
