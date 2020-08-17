import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ServiceTypeService } from "src/app/services/service-type.service";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { CategoriaService } from "src/app/services/categoria.service";
import { ServiceType } from "src/app/models/serviceType";

@Component({
  selector: "app-register-service-type-modal",
  templateUrl: "./register-service-type-modal.component.html",
  styleUrls: ["./register-service-type-modal.component.scss"]
})
export class RegisterServiceTypeModalComponent implements OnInit {
  code: {};
  data: ServiceType = new ServiceType();
  saveInProgress: boolean = false;
  formData = new FormData();
  categorias: any = [];
  arquivos: File[] = [];
  permissionsAdded = [];
  editar: boolean;
  filereader: FileReader;
  fileToUpload: File = null;
  categoriaCodigo: any;
  validNome: boolean = true;
  validCategoria: boolean = true;
  validFoto: boolean = true;
  validDescricao: boolean = true;
  situacaoString: string;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private serviceType: ServiceTypeService,
    private nbToastrService: NbToastrService,
    private categoriaService: CategoriaService,
    private nbDialogRef: NbDialogRef<RegisterServiceTypeModalComponent>
  ) {}

  ngOnInit() {
    this.getCategorias();
    this.changeDetection.detectChanges();
    if (this.data != undefined && this.data != null) {
      this.situacaoString =
        this.data.situacao || this.data.situacao == undefined
          ? "Ativo"
          : "Inativo";
      this.categoriaCodigo = this.data.categoriaCodigo;
    }
  }
  fetchGroups(code) {
    this.categoriaCodigo = code;
  }
  validaObrigatoriedade(param1) {
    switch (param1) {
      case "validNome":
        if (
          this.data != undefined &&
          this.data.nome != undefined &&
          this.data.nome.length > 0
        )
          this.validNome = true;
        else this.validNome = false;
        break;
      case "validCategoria":
        if (
          this.data != undefined &&
          this.categoriaCodigo != undefined &&
          this.data.categoriaCodigo != undefined &&
          this.data.categoriaCodigo.length > 0
        )
          this.validCategoria = true;
        else this.validCategoria = false;
        break;
      case "validFoto":
        if (
          this.data != undefined &&
          this.data.nomeFoto != undefined &&
          this.data.nomeFoto.length > 0
        )
          this.validFoto = true;
        else this.validFoto = false;
        break;
      case "validDescricao":
        if (
          this.data != undefined &&
          this.data.descricao != undefined &&
          this.data.descricao.length > 0
        )
          this.validDescricao = true;
        else this.validDescricao = false;
        break;
      default:
        this.validFoto = false;
        this.validCategoria = false;
        this.validNome = false;
        this.validDescricao = false;

        break;
    }
  }
  handleFileInput(event: any) {
    this.data.nomeFoto = event.currentTarget.files[0].name;
    this.data.tipoFoto = event.currentTarget.files[0].name.substr(
      event.currentTarget.files[0].name.lastIndexOf(".") + 1
    );
    this.editar = false;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.data.foto = reader.result.toString();
    };
  }

  downloadPictureServer(data: any) {
    this.serviceType.getPhoto(data.foto, this.data.nomeFoto);
  }

  getCategorias() {
    this.editar = true;
    this.categoriaService.fetch().subscribe(({ value }) => {
      this.categorias = value.map(item => {
        return {
          name: item.descricao,
          id: item.id,
          ...item
        };
      });
      this.categorias.forEach(element => {
        if (element.id == this.categoriaCodigo)
          this.data.categoriaCodigo = element.name;
      });
    });
  }

  save() {
    this.data.deletado = false;
    this.data.file = this.data.foto;
    this.categorias.forEach(element => {
      if (element.id == this.categoriaCodigo)
        this.data.categoriaCodigo = element.id;
    });
    if (
      this.data.nome != undefined &&
      this.data.descricao != undefined &&
      this.data.foto != undefined &&
      this.categoriaCodigo != undefined &&
      this.data.categoriaCodigo != undefined
    ) {
      if (this.data.id) {
        this.serviceType.update(this.data).subscribe(res => {
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
        this.data.situacao = true;

        this.serviceType.save(this.data).subscribe(res => {
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

      this.validaObrigatoriedade("validNome");
      this.validaObrigatoriedade("validCategoria");
      this.validaObrigatoriedade("validDescricao");
      this.validaObrigatoriedade("validFoto");
    }
    this.validaObrigatoriedade("validNome");
    this.validaObrigatoriedade("validCategoria");
    this.validaObrigatoriedade("validDescricao");
    this.validaObrigatoriedade("validFoto");
  }

  ngAfterContentChecked() {
    this.setValuesOnFields();
  }
  setValuesOnFields() {
    if (this.data != undefined && this.data.nome != "")
      this.data.categoriaCodigo = this.categorias[0];
  }

  close() {
    this.data = null;
    this.nbDialogRef.close();
  }
}
