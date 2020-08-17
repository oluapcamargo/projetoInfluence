import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef
} from "@angular/core";
import { Util } from "src/app/utils/util";
import { UtilService } from "src/app/services/util.service";

import { StoreFotoType } from "src/app/models/storyFoto";
import { NbToastrService, NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-tab-photos",
  templateUrl: "./tab-photos.component.html",
  styleUrls: ["./tab-photos.component.scss"]
})
export class TabPhotosComponent implements OnInit {
  descricao = "";
  nomeFoto = "";
  perfil: boolean;
  isOrdered = false;
  descricaoFotoValid = false;
  validFoto = false;
  dataAux = [];
  searchText = "";
  data = new StoreFotoType();
  @Output() dataPhotosModal = new EventEmitter();
  @Output() dataPhotosModalRemover = new EventEmitter();

  @Input() dataListaPhoto = [];
  @Input() perfilItem;

  elementosComClickInserido = [];

  defaultColumns = [
    { field: "Descricao", type: "text", name: "Descrição" },
    { field: "Perfil", type: "text", name: "Foto de Perfil" },
    { field: "Perfil", type: "ativarEditar", name: "Ações" }
  ];

  constructor(
    private util: Util,
    private utilService: UtilService,
    private elementRef: ElementRef,
    private nbToastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.addEvent();
    if (this.dataListaPhoto == undefined || this.dataListaPhoto == null)
      this.dataListaPhoto = [];
    if (this.perfilItem != undefined && !this.perfilItem) {
      if (this.data.Descricao != undefined) {
        this.defaultColumns = [
          { field: "Descricao", type: "text", name: "Descrição" },
          { field: "Descricao", type: "ativarEditar", name: "Ações" }
        ];
      } else {
        this.defaultColumns = [
          { field: "Descricao", type: "text", name: "Descrição" },
          { field: "Descricao", type: "ativarEditar", name: "Ações" }
        ];
      }
    } else this.perfilItem = true;

    this.addEvent();
  }
  search(event) {}

  handleFileInput(event: any) {
    this.data.NomeFoto = event.currentTarget.files[0].name;
    this.nomeFoto = this.data.NomeFoto;
    this.data.TipoFoto = event.currentTarget.files[0].name.substr(
      event.currentTarget.files[0].name.lastIndexOf(".") + 1
    );
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.data.File = reader.result.toString();
    };
    this.validFoto = false;
  }

  order(column: string = "nome") {
    this.dataListaPhoto = this.dataAux.sort((a, b) => {
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

  downloadPictureServer(data: any) {
    this.utilService.getPhoto(
      data.File == undefined ? data.foto : data.File,
      data.NomeFoto == undefined ? data.nomeFoto : data.NomeFoto
    );
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      if (allElements.length > 1) {
        let aux = allElements;
        allElements = [];
        for (const element of aux) {
          if (element.getAttribute("eventName") != "foto")
            allElements.push(element);
        }
      }
      let count = 0;
      for (const item of this.dataListaPhoto) {
        for (let k = 0; k < 3; k++) {
          const element = allElements[count];
          if (element.getAttribute("eventName") != "foto") {
            let desc =
              item.Descricao != undefined ? item.Descricao : item.descricao;
            if (!this.elementosComClickInserido.includes(element)) {
              element.addEventListener(
                "click",
                () => {
                  element.getAttribute("eventName") == "Editar"
                    ? this.detail(desc)
                    : element.getAttribute("eventName") == "Delete"
                    ? this.remover(desc)
                    : this.downloadPictureServer(item);
                },
                false
              );
              this.elementosComClickInserido.push(element);
            }
          }
          count += 1;
        }
      }
    }, 1000);
  }

  remover(tipoServico: String) {
    let dataAux = [];
    this.dataListaPhoto.forEach(element => {
      if (
        (element.Descricao != undefined
          ? element.Descricao
          : element.descricao) != tipoServico
      )
        dataAux.push(element);
      if (
        (element.Descricao != undefined
          ? element.Descricao
          : element.descricao) == tipoServico
      )
        this.dataPhotosModalRemover.emit(element);
    });
    this.dataListaPhoto = [];
    this.dataListaPhoto = dataAux;
  }

  detail(tpServico) {
    for (let index = 0; index < this.dataListaPhoto.length; index++) {
      if (
        (this.dataListaPhoto[index].Descricao != undefined
          ? this.dataListaPhoto[index].Descricao
          : this.dataListaPhoto[index].descricao) == tpServico
      ) {
        this.data.Descricao =
          this.dataListaPhoto[index].Descricao != undefined
            ? this.dataListaPhoto[index].Descricao
            : this.dataListaPhoto[index].descricao;
        this.data.NomeFoto =
          this.dataListaPhoto[index].NomeFoto != undefined
            ? this.dataListaPhoto[index].NomeFoto
            : this.dataListaPhoto[index].nomeFoto;
        this.data.Perfil = this.dataListaPhoto[index].Perfil;
        this.data.File = this.dataListaPhoto[index].File;
        this.data.TipoFoto =
          this.dataListaPhoto[index].TipoFoto != undefined
            ? this.dataListaPhoto[index].TipoFoto
            : this.dataListaPhoto[index].tipoFoto;

        this.remover(tpServico);
      }
    }
  }

  newValue() {
    if (this.data.Descricao != undefined && this.data.NomeFoto != undefined) {
      this.validFoto = false;
      let Cadastrar = true;

      if (this.data.Perfil) {
        this.dataListaPhoto.forEach(element => {
          if (element.Perfil) {
            this.nbToastrService.warning(
              "Já existe uma foto marcada como perfil.",
              "Atenção",
              {
                duration: 2000
              }
            );
            Cadastrar = false;
          }
        });
      } else {
        if (this.data.Perfil == undefined) this.data.Perfil = "false";
      }
      if (Cadastrar && this.validCamposObrigatorios()) {
        // for (let index = 0; index < this.dataListaPhoto.length; index++) {
        //   this.dataPhotosModalRemover.emit(this.dataListaPhoto[index]);
        // }
        this.dataListaPhoto.push(this.data);
        this.dataPhotosModal.emit(this.data);
        // for (let index = 0; index < this.dataListaPhoto.length; index++) {
        //   this.dataPhotosModal.emit(this.dataListaPhoto[index]);
        // }
        this.data = new StoreFotoType();
        this.addEvent();
      }
    } else {
      this.nbToastrService.warning(
        "É necessário preencher os campos obrigatórios.",
        "Atenção",
        {
          duration: 3000
        }
      );
      if (this.data.Descricao == undefined) this.descricaoFotoValid = true;
    }
  }
  validCamposObrigatorios() {
    if (
      this.data.Descricao.length > 0 &&
      this.data.NomeFoto != undefined &&
      this.data.NomeFoto != null &&
      this.data.NomeFoto.length > 0
    ) {
      this.validFoto = false;
      this.descricaoFotoValid = false;
      return true;
    } else {
      this.validFoto = this.data.Descricao.length > 0 ? false : true;
      this.descricaoFotoValid =
        this.data.NomeFoto != undefined &&
        this.data.NomeFoto != null &&
        this.data.NomeFoto.length > 0
          ? false
          : true;
      return false;
    }
  }
}
