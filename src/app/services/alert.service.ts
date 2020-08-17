import { Injectable } from "@angular/core";
import { NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: "root"
})
export class AlertService {
  private params = {
    duration: 3000,
    preventDuplicates: true,
    destroyByClick: true
  };

  constructor(private toastrService: NbToastrService) {}

  success = (
    msg: any = "Sua ação foi concluída com sucesso",
    title: any = "Sucesso",
    config: any = this.params
  ) => {
    this.toastrService.success(msg, title, config);
  };

  error = (
    msg: any = "Ao realizar a operação",
    title: any = "Erro",
    config: any = this.params
  ) => {
    this.toastrService.danger(msg, title, config);
  };

  warning = (
    msg: any = "Ao salvar/carregar o registro.",
    title: any = "Falha",
    config: any = this.params
  ) => {
    this.toastrService.warning(msg, title, config);
  };

  info = (msg: any, title: any = "Informação", config: any = this.params) => {
    this.toastrService.info(msg, title, config);
  };
}
