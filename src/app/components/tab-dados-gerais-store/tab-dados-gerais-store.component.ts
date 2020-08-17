import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UtilService } from "../../services/util.service";
import { ServiceTypeService } from "../../services/service-type.service";
import { NgxMaskModule } from "ngx-mask";
import { TabDadosGeraisType } from "src/app/models/tabDadosGerais";

@Component({
  selector: "app-tab-dados-gerais-store",
  templateUrl: "./tab-dados-gerais-store.component.html",
  styleUrls: ["./tab-dados-gerais-store.component.scss"]
})
export class TabDadosGeraisStoreComponent implements OnInit {
  dataAux = [];
  @Input() data: TabDadosGeraisType;
  isOrdered = false;
  searchText = "";
  @Output() dataDadosGeraisModal = new EventEmitter();
  filtro: TabDadosGeraisType = new TabDadosGeraisType();
  Estados = [];
  Bairro = [];
  Municipio = [];
  cnpjValid = false;
  nomeValid = false;
  responsavelValid = false;
  descricaoValid = false;
  cepValid = false;
  ufValid = false;
  municipioValid = false;
  bairroValid = false;
  ruaValid = false;
  numeroEnderecoValid = false;
  telefonValid = false;
  emailValid = false;
  periodoAtendimentoValid = false;
  horarioAtendimentoValid = false;
  tipoEstabelecimento = 0;
  tipoServico = [];
  timeArray = [];
  DiasAtendimento = [
    { id: 1, nome: "Domingo" },
    { id: 2, nome: "Segunda-feira" },
    { id: 3, nome: "Terça-feira" },
    { id: 4, nome: "Quarta-feira" },
    { id: 5, nome: "Quinta-feira" },
    { id: 6, nome: "Sexta-feira" },
    { id: 7, nome: "Sábado" }
  ];
  constructor(
    private utilService: UtilService,
    private serviceTypeService: ServiceTypeService
  ) {}

  ngOnInit() {
    this.fetchUF();
    this.generateTimeArray();
    this.getTipoServico();
    if (this.data != null && this.data != undefined) {
      this.filtro = this.data;
      this.tipoEstabelecimento = parseInt(this.data.tipoEstabelecimento);
      this.fetchMunicipios(this.data.ufId);
      this.fetchBairros(this.data.municipioId);
      this.filtro.ufId = this.data.ufId.toString();
      this.filtro.municipioId = this.data.municipioId;
      this.filtro.bairroId = this.data.bairroId;
    }
  }
  ngOnChanges() {
    this.dataDadosGeraisModal.emit(this.filtro);
  }

  validacaoCamposObrigatorios() {
    if (this.filtro != null && this.filtro != undefined) {
      if (
        this.filtro.cnpj == undefined ||
        this.filtro.cnpj == null ||
        this.filtro.cnpj.length == 0
      )
        this.cnpjValid = false;
      if (
        this.filtro.nome == undefined ||
        this.filtro.nome == null ||
        this.filtro.nome.length == 0
      )
        this.nomeValid = false;
      if (
        this.filtro.responsavel == undefined ||
        this.filtro.responsavel == null ||
        this.filtro.responsavel.length == 0
      )
        this.responsavelValid = false;
      if (
        this.filtro.descricao == undefined ||
        this.filtro.descricao == null ||
        this.filtro.descricao.length == 0
      )
        this.descricaoValid = false;
      if (
        this.filtro.nome == undefined ||
        this.filtro.nome == null ||
        this.filtro.nome.length == 0
      )
        this.cepValid = false;
      if (
        this.filtro.ufId == undefined ||
        this.filtro.ufId == null ||
        this.filtro.ufId.length == 0
      )
        this.ufValid = false;
      if (
        this.filtro.municipioId == undefined ||
        this.filtro.municipioId == null ||
        this.filtro.municipioId.length == 0
      )
        this.municipioValid = false;
      if (
        this.filtro.bairroId == undefined ||
        this.filtro.bairroId == null ||
        this.filtro.bairroId.length == 0
      )
        this.bairroValid = false;
      if (
        this.filtro.rua == undefined ||
        this.filtro.rua == null ||
        this.filtro.rua.length == 0
      )
        this.ruaValid = false;
      if (
        this.filtro.numeroEndereco == undefined ||
        this.filtro.numeroEndereco == null ||
        this.filtro.numeroEndereco.length == 0
      )
        this.numeroEnderecoValid = false;
      if (
        this.filtro.telefone == undefined ||
        this.filtro.telefone == null ||
        this.filtro.telefone.length == 0
      )
        this.telefonValid = false;
      if (
        this.filtro.enderecoEmail == undefined ||
        this.filtro.enderecoEmail == null ||
        this.filtro.enderecoEmail.length == 0
      )
        this.emailValid = false;
      if (
        this.filtro.diaInicioAtendimentoPadrao == undefined ||
        this.filtro.diaInicioAtendimentoPadrao == null ||
        this.filtro.diaInicioAtendimentoPadrao.length == 0 ||
        this.filtro.diaFimAtendimentoPadrao == undefined ||
        this.filtro.diaFimAtendimentoPadrao == null ||
        this.filtro.diaFimAtendimentoPadrao.length == 0
      )
        this.periodoAtendimentoValid = false;
      if (
        this.filtro.horaInicioAtendimentoPadrao == undefined ||
        this.filtro.horaInicioAtendimentoPadrao == null ||
        this.filtro.horaInicioAtendimentoPadrao.length == 0 ||
        this.filtro.horaFimAtendimentoPadrao == undefined ||
        this.filtro.horaFimAtendimentoPadrao == null ||
        this.filtro.horaFimAtendimentoPadrao.length == 0
      )
        this.horarioAtendimentoValid = false;
    }
  }

  getTipoServico() {
    this.serviceTypeService.fetchCombo().subscribe(({ value }) => {
      this.tipoServico = value.map(item => {
        return {
          ...item
        };
      });
      let listArray = this.tipoServico;
      this.tipoServico = [];
      listArray.forEach(element => {
        if (element.situacao) this.tipoServico.push(element);
      });
      listArray = [];
    });
  }
  generateTimeArray() {
    for (let hours = 7; hours <= 23; hours++) {
      for (let minutes = 0; minutes < 60; ) {
        this.timeArray.push(
          (hours.toString().length == 1
            ? "0" + hours.toString()
            : hours.toString()) +
            ":" +
            (minutes.toString().length == 1
              ? "0" + minutes.toString()
              : minutes.toString())
        );
        minutes += 30;
      }
    }
    this.timeArray.push("00:00");
  }
  fetchUF() {
    this.Municipio = [];
    this.Bairro = [];

    this.utilService.UF().subscribe(({ value }) => {
      this.Estados = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  fetchMunicipios(code: string) {
    this.ngOnChanges();
    this.Bairro = [];
    if (this.filtro["municipio"] != undefined && this.filtro["municipio"] != "")
      this.filtro["municipio"] = "";
    this.utilService.Municipio(code).subscribe(({ value }) => {
      this.Municipio = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  fetchBairros(code: string) {
    this.ngOnChanges();
    if (this.filtro["bairro"] != undefined && this.filtro["bairro"] != "")
      this.filtro["bairro"] = "";
    this.utilService.Bairro(code).subscribe(({ value }) => {
      this.Bairro = value.map(item => {
        return {
          ...item
        };
      });
    });
  }
}
