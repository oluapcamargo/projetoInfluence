import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  data = [];
  atendimentosAno = "2000";
  faturamentoAno = "150.000";
  atendimentosMes = "56";
  faturamentoMes = "560,00";
  atendimentosAguardandoConfirmacao = "";
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // this.getDadosDashBoard();
  }
  // getDadosDashBoard() {
  //   this.dashboardService.fetch().subscribe(({ value }) => {
  //     this.data = value;
  //     this.atendimentosAguardandoConfirmacao = this.data[
  //       "atendimentosAguardandoConfirmacao"
  //     ];
  //     this.atendimentosAno = this.data["atendimentosAno"];
  //     this.faturamentoAno = this.data["faturamentoAno"];
  //     this.atendimentosMes = this.data["atendimentosMes"];
  //     this.faturamentoMes = this.data["faturamentoMes"];
  //   });
  // }
}
