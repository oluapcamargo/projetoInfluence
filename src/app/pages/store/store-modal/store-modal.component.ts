import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { CategoriaService } from "src/app/services/categoria.service";
import { Util } from "src/app/utils/util";
import { ServiceTypeService } from "src/app/services/service-type.service";
import { UtilService } from "../../../services/util.service";

import { MatIconModule } from "@angular/material/icon";
import { StoreType } from "src/app/models/store";
import { StoreFotoType } from "src/app/models/storyFoto";
import { StoreEmployeeType } from "src/app/models/storyEmployee";
import { StoreServiceType } from "src/app/models/storyServiceType";
import { TabDadosGeraisType } from "src/app/models/tabDadosGerais";
import { TabDadosGeraisStoreComponent } from "src/app/components/tab-dados-gerais-store/tab-dados-gerais-store.component";
import { TabEmployeeType } from "src/app/models/tabEmployee";
import { TabTipoServicoType } from "src/app/models/tabTipoServico";
import { NgSelectConfig } from "@ng-select/ng-select";
import { CurrentUserService } from "../../../services/current-user.service";

@Component({
  selector: "app-store-modal",
  templateUrl: "./store-modal.component.html",
  styleUrls: ["./store-modal.component.scss"]
})
export class StoreModalComponent implements OnInit {
  code: {};
  data: StoreType = new StoreType();
  datatipoServico: [];
  store: StoreType;
  formData = new FormData();
  validacao = "";
  timeArray = [];
  filtroDadosGeraisInput: TabDadosGeraisType;
  filtroPhotoInput: StoreFotoType[];
  filtroEmployeeInput: TabEmployeeType[];
  filtroTipoServicoInput: TabTipoServicoType[];
  dataDadosGeraisModal = [];
  dataTipoServicoModal = [];
  dataProfissionalModalPrincipal = [];
  dataPhotosModal = [];
  categorias: any = [];
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
  tipoServico: any[];
  isReadOnly = false;
  arquivos: File[] = [];
  permissionsAdded = [];
  filereader: FileReader;
  flagDestaqueString = "";
  situacaoString = "";
  fileToUpload: File = null;
  @Output() validarCamposDadosGerais = new EventEmitter();

  columns = [
    { field: "nome", name: "Tipo de Serviço" },
    { field: "duracao", name: "Duração Média" },
    { field: "valor", name: "Valor" },
    { field: "valorPromocional", name: "Valor Promocional" },
    { field: "situacao", type: "ativarEditar", name: "Ações" }
  ];

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
    private storeService: StoreService,
    private nbToastrService: NbToastrService,
    private icon: MatIconModule,
    private categoriaService: CategoriaService,
    private serviceTypeService: ServiceTypeService,
    private util: Util,
    private currentUser: CurrentUserService,

    private utilService: UtilService,
    private nbDialogRef: NbDialogRef<StoreModalComponent>
  ) {}

  async ngOnInit() {
    this.fetchTipoServico();
    this.generateTimeArray();
    this.fetchUF();
    if (this.data != undefined && this.data.id != undefined) {
      const { tipoUsuario } = await this.currentUser.getUser();
      if (tipoUsuario != 0) {
        this.isReadOnly = true;
        this.flagDestaqueString =
          this.data.flagDestaque.toString() == "0" ? "Não" : "Sim";
      }
      this.montarObjetosInput();
      this.fetchMunicipio(this.data.ufId);
      this.fetchBairros(this.data.municipioId);

      this.data.ufId = this.data.ufId;
      this.data.municipioId = this.data.municipioId;
      this.data.bairroId = this.data.bairroId;
      this.data.tipoEstabelecimento = this.data.tipoEstabelecimento.toString();
    } else {
      this.data.situacao = 2;
    }
    this.descricaoSituacao();
    this.getCategorias();
  }

  descricaoSituacao() {
    switch (this.data.situacao) {
      case 1:
        this.situacaoString = "Aguardando avaliação";
        break;
      case 2:
        this.situacaoString = "Ativo";
        break;
      case 3:
        this.situacaoString = "Inativo";
        break;
      case 4:
        this.situacaoString = "Reprovado";
        break;
    }
  }

  ngOnChanges() {
    // this.validacaoCamposObrigatorios();
  }

  validacaoCamposObrigatorios() {
    let camposValidos = true;
    if (this.data != null && this.data != undefined) {
      if (
        this.data.cnpj == undefined ||
        this.data.cnpj == null ||
        this.data.cnpj.length == 0
      ) {
        camposValidos = false;
        this.cnpjValid = true;
      } else this.cnpjValid = false;

      if (
        this.data.nome == undefined ||
        this.data.nome == null ||
        this.data.nome.length == 0
      ) {
        camposValidos = false;
        this.nomeValid = true;
      } else this.nomeValid = false;
      if (
        this.data.responsavel == undefined ||
        this.data.responsavel == null ||
        this.data.responsavel.length == 0
      ) {
        camposValidos = false;
        this.responsavelValid = true;
      } else this.responsavelValid = false;
      if (
        this.data.descricao == undefined ||
        this.data.descricao == null ||
        this.data.descricao.length == 0
      ) {
        camposValidos = false;
        this.descricaoValid = true;
      } else this.descricaoValid = false;
      if (
        this.data.nome == undefined ||
        this.data.nome == null ||
        this.data.nome.length == 0
      ) {
        camposValidos = false;
        this.cepValid = true;
      } else this.cepValid = false;
      if (
        this.data.ufId == undefined ||
        this.data.ufId == null ||
        this.data.ufId.length == 0
      ) {
        camposValidos = false;
        this.ufValid = true;
      } else this.ufValid = false;
      if (
        this.data.municipioId == undefined ||
        this.data.municipioId == null ||
        this.data.municipioId.length == 0
      ) {
        camposValidos = false;
        this.municipioValid = true;
      } else this.municipioValid = false;
      if (
        this.data.bairroId == undefined ||
        this.data.bairroId == null ||
        this.data.bairroId.length == 0
      ) {
        camposValidos = false;
        this.bairroValid = true;
      } else this.bairroValid = false;
      if (
        this.data.rua == undefined ||
        this.data.rua == null ||
        this.data.rua.length == 0
      ) {
        camposValidos = false;
        this.ruaValid = true;
      } else this.ruaValid = false;
      if (
        this.data.numeroEndereco == undefined ||
        this.data.numeroEndereco == null ||
        this.data.numeroEndereco.length == 0
      ) {
        camposValidos = false;
        this.numeroEnderecoValid = true;
      } else this.numeroEnderecoValid = false;
      if (
        this.data.telefone == undefined ||
        this.data.telefone == null ||
        this.data.telefone.length == 0
      ) {
        camposValidos = false;
        this.telefonValid = true;
      } else this.telefonValid = false;
      if (
        this.data.enderecoEmail == undefined ||
        this.data.enderecoEmail == null ||
        this.data.enderecoEmail.length == 0
      ) {
        camposValidos = false;
        this.emailValid = true;
      } else this.emailValid = false;
      if (
        this.data.diaInicioAtendimentoPadrao == undefined ||
        this.data.diaInicioAtendimentoPadrao == null ||
        this.data.diaInicioAtendimentoPadrao == 0 ||
        this.data.diaFimAtendimentoPadrao == undefined ||
        this.data.diaFimAtendimentoPadrao == null ||
        this.data.diaFimAtendimentoPadrao == 0
      ) {
        camposValidos = false;
        this.periodoAtendimentoValid = true;
      } else this.periodoAtendimentoValid = false;
      if (
        this.data.horaInicioAtendimentoPadrao == undefined ||
        this.data.horaInicioAtendimentoPadrao == null ||
        this.data.horaInicioAtendimentoPadrao.length == 0 ||
        this.data.horaFimAtendimentoPadrao == undefined ||
        this.data.horaFimAtendimentoPadrao == null ||
        this.data.horaFimAtendimentoPadrao.length == 0
      ) {
        camposValidos = false;
        this.horarioAtendimentoValid = true;
      } else this.horarioAtendimentoValid = false;
    }
    if (!camposValidos)
      this.nbToastrService.warning(
        "Existem campos de preenchimento obrigatório na aba de dados gerais.",
        "Atenção",
        {
          duration: 2000
        }
      );
    return camposValidos;
  }

  montarObjetosInput() {
    this.filtroPhotoInput = this.data.estabelecimentoFoto;

    this.storeService.fetchByEstabId(this.data.id).subscribe(({ value }) => {
      this.data = value;

      if (this.data.estabelecimentoFoto.length > 0) {
        let foto = new StoreFotoType();
        this.filtroPhotoInput = [];
        for (
          let index = 0;
          index < this.data.estabelecimentoFoto.length;
          index++
        ) {
          foto.Descricao = this.data.estabelecimentoFoto[index]["descricao"];
          foto.File = this.data.estabelecimentoFoto[index]["foto"];
          foto.NomeFoto = this.data.estabelecimentoFoto[index]["nomeFoto"];
          foto.Perfil = this.data.estabelecimentoFoto[index]["perfil"];
          foto.TipoFoto = this.data.estabelecimentoFoto[index]["tipoFoto"];
          this.filtroPhotoInput.push(foto);
          this.eventTabPhotos(foto);
          foto = new StoreFotoType();
        }
      }
      if (this.data.estabelecimentoProfissional.length > 0) {
        this.filtroEmployeeInput = [];
        let profissionais = new TabEmployeeType();
        for (
          let index = 0;
          index < this.data.estabelecimentoProfissional.length;
          index++
        ) {
          profissionais.nome = this.data.estabelecimentoProfissional[index][
            "nomeProfissional"
          ];
          this.filtroEmployeeInput.push(profissionais);
          this.eventTabProfissional(profissionais);

          profissionais = new TabEmployeeType();
        }
      }
      if (this.data.estabelecimentoTipoServico.length > 0) {
        this.filtroTipoServicoInput = [];
        let tipoServico = new TabTipoServicoType();
        for (
          let index = 0;
          index < this.data.estabelecimentoTipoServico.length;
          index++
        ) {
          tipoServico.id = this.data.estabelecimentoTipoServico[index][
            "codigoTipoServico"
          ];
          tipoServico.duracao = this.data.estabelecimentoTipoServico[index][
            "duracao"
          ];
          let tp = this.tipoServico.find(
            ({ id }) =>
              id ===
              this.data.estabelecimentoTipoServico[index]["codigoTipoServico"]
          );
          tipoServico.tipoServico =
            tp != null && tp != undefined
              ? tp.nome
              : "Tipo de Serviço inativo.";
          tipoServico.valor =
            "R$" + this.data.estabelecimentoTipoServico[index]["valor"];
          tipoServico.valorPromocional =
            "R$" +
            this.data.estabelecimentoTipoServico[index]["valorPromocional"];
          this.filtroTipoServicoInput.push(tipoServico);
          this.eventTabTipoServico(tipoServico);

          tipoServico = new TabTipoServicoType();
        }
      }
    });
  }
  eventTabProfissional(profissionais) {
    this.dataProfissionalModalPrincipal.push(profissionais);
    this.validacaoCamposObrigatorios();
  }

  eventTabProfissionalRemover(profissionais) {
    this.dataProfissionalModalPrincipal = [];
    this.dataProfissionalModalPrincipal = profissionais;
    this.validacaoCamposObrigatorios();
  }

  eventTabPhotos(photos) {
    this.dataPhotosModal.push(photos);
    this.validacaoCamposObrigatorios();
  }

  eventTabPhotosRemover(photos) {
    let aux = this.dataPhotosModal;
    this.dataPhotosModal = [];
    aux.forEach(element => {
      if (element != photos) this.dataPhotosModal.push(element);
    });
    this.validacaoCamposObrigatorios();
  }

  eventTabTipoServico(tipoServico) {
    this.dataTipoServicoModal.push(tipoServico);
    this.validacaoCamposObrigatorios();
  }

  eventTabTipoServicoRemover(tipoServico) {
    let aux = this.dataTipoServicoModal;
    this.dataTipoServicoModal = [];
    aux.forEach(element => {
      if (element != tipoServico) this.dataTipoServicoModal.push(element);
    });
    this.validacaoCamposObrigatorios();
  }

  fetchTipoServico() {
    this.serviceTypeService.fetchCombo().subscribe(({ value }) => {
      this.tipoServico = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  getCategorias() {
    this.categoriaService.fetch().subscribe(({ value }) => {
      this.categorias = value.map(item => {
        return {
          name: item.descricao,
          codigo: item.codigo,
          ...item
        };
      });
    });
  }
  MapeandoStory() {
    this.store = this.data;
    this.store.percentualTaxaIsalon = this.data.percentualTaxaIsalon.toString();
    this.store.tipoEstabelecimento = this.data.tipoEstabelecimento.toString();

    this.store.estabelecimentoFoto = [];
    for (let k = 0; k < this.dataPhotosModal.length; k++) {
      var foto = new StoreFotoType();
      foto.Descricao = this.dataPhotosModal[k]["Descricao"];
      foto.File = this.dataPhotosModal[k]["File"];
      foto.NomeFoto = this.dataPhotosModal[k]["NomeFoto"];
      foto.Perfil =
        this.dataPhotosModal[k]["Perfil"] == true ? "true" : "false";
      foto.TipoFoto = this.dataPhotosModal[k]["TipoFoto"];
      this.store.estabelecimentoFoto.push(foto);
    }
    this.store.estabelecimentoProfissional = [];
    for (let k = 0; k < this.dataProfissionalModalPrincipal.length; k++) {
      let profissional = new StoreEmployeeType();
      profissional.Nome = this.dataProfissionalModalPrincipal[k]["nome"];
      this.store.estabelecimentoProfissional.push(profissional);
    }
    this.store.estabelecimentoTipoServico = [];
    for (let k = 0; k < this.dataTipoServicoModal.length; k++) {
      let tiposervico = new StoreServiceType();
      tiposervico.Duracao = this.dataTipoServicoModal[k]["duracao"];
      tiposervico.Valor = this.dataTipoServicoModal[k]["valor"];
      tiposervico.ValorPromocional =
        this.dataTipoServicoModal[k]["valorPromocional"] == undefined ||
        this.dataTipoServicoModal[k]["valorPromocional"] == null
          ? "0"
          : this.dataTipoServicoModal[k]["valorPromocional"];
      tiposervico.tipoServico = this.dataTipoServicoModal[k]["id"];
      this.store.estabelecimentoTipoServico.push(tiposervico);
    }
  }
  mappingStore() {
    this.validacao = "";

    if (!this.validacaoCamposObrigatorios()) this.validacao += "dadosgerais;";
    let element = document.getElementById("buttonSalvar");
    element.attributes["disabled"] = true;
    if (!(this.dataPhotosModal.length > 0)) this.validacao = "photos;";
    if (!(this.dataTipoServicoModal.length > 0))
      this.validacao += "tiposervico;";
    this.store = new StoreType();
    if (this.validacao == "") {
      this.MapeandoStory();
    }
    if (this.validacao != "") {
      let msg = "";
      let val = this.validacao.split(";");
      val.forEach(element => {
        if (element == "photos")
          msg += "É necessário cadastrar ao menos uma foto.";
        if (element == "tiposervico")
          msg += " É necessário cadastrar ao menos um tipo de serviço.";
        else
          msg +=
            " É necessário o preenchimento dos campos na aba dados gerais. " +
            this.validacao;
      });
      this.nbToastrService.warning(msg, "Atenção", {
        duration: 2000
      });
    } else {
      this.save();
    }
  }

  save() {
    if (this.store.estabelecimentoProfissional.length == 0)
      this.store.estabelecimentoProfissional = null;
    this.store.flagDestaque =
      this.store.flagDestaque == undefined || this.store.flagDestaque == null
        ? "false"
        : this.store.flagDestaque.toString();

    this.store.enderecoSite = this.store.enderecoSite
      ? this.store.enderecoSite
      : "";
    this.store.diaInicioAtendimentoEspecial = this.store
      .diaInicioAtendimentoEspecial
      ? this.store.diaInicioAtendimentoEspecial
      : 0;
    this.store.diaFimAtendimentoEspecial = this.store.diaFimAtendimentoEspecial
      ? this.store.diaFimAtendimentoEspecial
      : 0;
    this.store.horaInicioAtendimentoEspecial = this.store
      .horaInicioAtendimentoEspecial
      ? this.store.horaInicioAtendimentoEspecial
      : "";
    this.store.horaFimAtendimentoEspecial = this.store
      .horaFimAtendimentoEspecial
      ? this.store.horaFimAtendimentoEspecial
      : "";
    if (this.store.id) {
      this.storeService.update(this.store.id, this.store).subscribe(
        res => {
          if (res.hasSuccess) {
            this.nbToastrService.success(
              "Registro atualizado com sucesso",
              "Sucesso",
              {
                duration: 2000
              }
            );
            this.close();
          } else
            this.nbToastrService.success("Falha ao salvar registro. ", "Erro", {
              duration: 2000
            });
          this.close();
        },
        () => {
          this.nbToastrService.danger("Falha ao salvar o registro", "Falha", {
            duration: 2000
          });
          this.close();
        }
      );
    } else {
      // this.store.situacao = "Ativa";
      this.storeService.save(this.store).subscribe(
        res => {
          if (res.hasSuccess) {
            this.nbToastrService.success(
              "Registro atualizado com sucesso",
              "Sucesso",
              {
                duration: 2000
              }
            );
            this.close();
          } else
            this.nbToastrService.danger(
              "Falha ao salvar registro. " + res.errors[0],
              "Erro",
              {
                duration: 2000
              }
            );
        },
        () => {
          this.nbToastrService.danger("Falha ao salvar o registro. ", "Falha", {
            duration: 2000
          });
          this.close();
        }
      );
    }
  }
  close() {
    this.nbDialogRef.close();
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
  fetchMunicipio(code: string) {
    this.utilService.Municipio(code).subscribe(({ value }) => {
      this.Municipio = value.map(item => {
        return {
          ...item
        };
      });
      this.Bairro = [];
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
