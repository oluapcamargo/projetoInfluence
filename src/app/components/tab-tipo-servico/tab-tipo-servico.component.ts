import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ElementRef
} from "@angular/core";
import { ServiceTypeService } from "src/app/services/service-type.service";
import { StoreServiceType } from "src/app/models/storyServiceType";
import { TabTipoServicoType } from "src/app/models/tabTipoServico";
import { NbToastrService, NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-tab-tipo-servico",
  templateUrl: "./tab-tipo-servico.component.html",
  styleUrls: ["./tab-tipo-servico.component.scss"]
})
export class TabTipoServicoComponent implements OnInit {
  searchText: string;
  dataAux = [];
  @Input() data = [];
  @Output() dataTipoServicoModal = new EventEmitter();
  @Output() dataTipoServicoModalRemover = new EventEmitter();

  isOrdered = false;
  tipoServicos = [];
  elementosComClickInserido = [];
  tipoServico = "";
  valor = "";
  valorPromocional = "";
  duracao = "";
  filter: TabTipoServicoType = new TabTipoServicoType();
  valorValid = false;
  valorPromotionalValid = false;
  duracaoValid = false;
  tiposervicoValid = false;

  defaultColumns = [
    { field: "tipoServico", type: "text", name: "Tipo de Serviço" },
    { field: "duracao", type: "text", name: "Duração Média" },
    { field: "valor", type: "valor", name: "Valor" },
    { field: "valorPromocional", type: "valor", name: "Valor Promocional" },
    { field: "situacao", type: "ativarEditar", name: "Ações" }
  ];
  constructor(
    private serviceTypeService: ServiceTypeService,
    private elementRef: ElementRef,
    private nbToastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.fetchTipoServico();
    if (this.data == undefined || this.data == null) this.data = [];

    this.addEvent();
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
          let tpServico = item.tipoServico;
          if (!this.elementosComClickInserido.includes(element)) {
            element.addEventListener(
              "click",
              () => {
                element.getAttribute("eventName") == "Editar"
                  ? this.detail(tpServico)
                  : this.remover(tpServico);
              },
              false
            );
            this.elementosComClickInserido.push(element);
          }
          // }
          count += 1;
        }
      }
    }, 1000);
  }

  detail(tpServico) {
    this.data.forEach(element => {
      if (element.tipoServico == tpServico) {
        this.filter.tipoServico = element.tipoServico;
        this.filter.duracao = element.duracao;
        this.filter.valor = element.valor.replace("R$", "");
        this.filter.valorPromocional = element.valorPromocional.replace(
          "R$",
          ""
        );
        this.remover(tpServico);
      }
    });
  }

  remover(tipoServico: String) {
    let dataAux = [];
    this.data.forEach(element => {
      if (element.tipoServico != tipoServico) dataAux.push(element);
      if (element.tipoServico == tipoServico)
        this.dataTipoServicoModalRemover.emit(element);
    });
    this.data = [];
    this.data = dataAux;
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

  fetchTipoServico() {
    this.serviceTypeService.fetchCombo().subscribe(({ value }) => {
      this.tipoServicos = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  tipoServicoJaCadastrado(tipoServico: string) {
    let retorno = false;
    this.data.forEach(element => {
      if (element.tipoServico == tipoServico) retorno = true;
    });
    return retorno;
  }

  search(event) {}
  valicacaoCamposObrigatorios() {
    this.valorPromotionalValid = false;

    if (
      this.filter.valor != null &&
      this.filter.valor != undefined &&
      this.filter.valorPromocional != undefined &&
      this.filter.valorPromocional != null &&
      this.filter.tipoServico != undefined &&
      this.filter.tipoServico != null &&
      this.filter.tipoServico != "" &&
      this.filter.duracao != undefined &&
      this.filter.duracao != null
    ) {
      if (this.filter.valor < this.filter.valorPromocional) {
        this.valorPromotionalValid = true;
        return false;
      }
      this.valorValid = false;
      this.duracaoValid = false;
      this.tiposervicoValid = false;
      return true;
    } else {
      if (
        this.filter.valor == null ||
        this.valor == undefined ||
        this.valor == ""
      )
        this.valorValid = true;

      if (
        this.filter.valorPromocional == null ||
        this.filter.valorPromocional == undefined ||
        this.filter.valorPromocional == ""
      )
        this.valorValid = true;

      if (
        this.filter.tipoServico == null ||
        this.filter.tipoServico == undefined ||
        this.filter.tipoServico == ""
      )
        this.tiposervicoValid = true;

      if (
        this.filter.duracao == null ||
        this.filter.duracao == undefined ||
        this.filter.duracao == ""
      )
        this.duracaoValid = true;

      return false;
    }
  }
  addTipoServico() {
    if (this.valicacaoCamposObrigatorios()) {
      if (this.tipoServicoJaCadastrado(this.tipoServico))
        this.remover(this.tipoServico);

      this.tipoServicos.forEach(element => {
        if (element.nome == this.filter.tipoServico)
          this.filter.id = element.id;
      });
      this.filter.valor = "R$" + this.filter.valor;
      this.filter.valorPromocional =
        this.filter.valorPromocional != undefined &&
        this.filter.valorPromocional
          ? "R$" + this.filter.valorPromocional
          : null;

      for (let index = 0; index < this.data.length; index++) {
        this.dataTipoServicoModalRemover.emit(this.data[index]);
      }
      this.data.push({
        valor: this.filter.valor,
        valorPromocional: this.filter.valorPromocional,
        duracao: this.filter.duracao,
        id: this.filter.id,
        tipoServico: this.filter.tipoServico
      });
      for (let index = 0; index < this.data.length; index++) {
        this.dataTipoServicoModal.emit(this.data[index]);
      }

      this.filter.id = "";
      this.filter.valor = "";
      this.filter.valorPromocional = "";
      this.filter.duracao = "";
      this.filter.tipoServico = "";
      this.addEvent();
    } else {
      this.nbToastrService.warning(
        "É necessário preencher os campos obrigatórios.",
        "Atenção",
        {
          duration: 3000
        }
      );
    }
  }
}
