import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  ElementRef
} from "@angular/core";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { HelperService } from "src/app/services/helper.service";

@Component({
  selector: "app-decision-alert",
  templateUrl: "./app-decision-alert.component.html",
  styleUrls: ["./app-decision-alert.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppDecisionAlertComponent implements OnInit {
  message: string;
  actionButton: string;
  action2Button: string;
  cancelButton: string;
  action2Show = false;
  descricaoShow = false;
  descricao = "";
  @Input() data: any[];
  eventName: string;

  constructor(
    protected dialogRef: NbDialogRef<AppDecisionAlertComponent>,
    private helperService: HelperService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.configuraElementosTable();
  }

  configuraElementosTable() {
    if (this.data) {
      if (
        this.data["tipoAcao"] == "check" ||
        this.data["tipoAcao"] == "block"
      ) {
        if (this.data["tipoAcao"] == "check") {
          this.message = "Favor digitar o motivo da aprovação.";
          this.actionButton = "Aprovar";
        } else {
          this.message = "Favor digitar o motivo da reprovação.";
          this.actionButton = "Reprovar";
        }
        this.cancelButton = "Voltar";
        this.descricaoShow = true;
      } else if (this.data["tipoAcao"] == "CancelarEvento") {
        this.message = "Favor digitar o motivo da cancelamento do evento.";
        this.actionButton = "Confirmar";
      } else {
        if (this.data["tipoAcao"] == "RevemorInscrito") {
          this.message = "Deseja realmente remover essa inscrição?";
          this.actionButton = "Confirmar";
          this.cancelButton = "Voltar";

          this.descricaoShow = true;
        } else {
          this.message = "Deseja realmente deletar o tipo de serviço?";
          this.actionButton = "Deletar";
          this.cancelButton = "Voltar";
        }
      }
    }
  }

  close() {
    this.helperService.closeModal(true);
    this.dialogRef.close(false);
  }

  save() {
    this.helperService.closeModal(true);
    if (this.descricaoShow) {
      let retorno = [this.actionButton, this.descricao];
      this.dialogRef.close(retorno);
    } else this.dialogRef.close(true);
  }
}
