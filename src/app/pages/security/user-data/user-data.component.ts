import { Component, OnInit, ElementRef } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { CurrentUserService } from "src/app/services/current-user.service";
import { UserNet } from "src/app/models/userNet";

@Component({
  selector: "app-user-data",
  templateUrl: "./user-data.component.html",
  styleUrls: ["./user-data.component.scss"]
})
export class UserDataComponent implements OnInit {
  data = new UserNet();

  tipoUsuario = "";
  telefone = "";
  email = "";
  nome = "";

  constructor(
    private userService: UserService,
    private router: Router,
    public uService: CurrentUserService
  ) {}

  ngOnInit() {
    if (
      this.uService == undefined ||
      this.uService.id == undefined ||
      this.uService.id == ""
    ) {
      this.userService.fetchUserById(localStorage.Id).subscribe(res => {
        this.uService = res;
        this.email = res["email"];
        this.tipoUsuario = res["grupos"][0]["descricao"];
        this.telefone = res["phoneNumber"];
        this.nome = res["nome"];
      });
    } else this.fetch();
  }

  async fetch() {
    this.userService.fetchUserById(localStorage.Id).subscribe(res => {
      this.uService = res;
      this.email = res["email"];
      this.tipoUsuario = res["grupos"][0]["descricao"];
      this.telefone = res["phoneNumber"];
      this.nome = res["nome"];
    });
  }
}
