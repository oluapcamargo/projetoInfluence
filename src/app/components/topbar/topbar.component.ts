import { Component, OnInit, Input } from "@angular/core";
import {
  NbSidebarService,
  NbSearchService,
  NbMenuService
} from "@nebular/theme";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"]
})
export class TopbarComponent implements OnInit {
  @Input()
  showNotificationButton = false;

  @Input()
  showMessageButton = false;
  user = {
    menu: [{ title: "Sair" }],
    nome: "",
    login: ""
  };
  routerLogo: string;

  constructor(
    private sidebarService: NbSidebarService,
    private searchService: NbSearchService,
    private router: Router,
    private menuService: NbMenuService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.searchService.onSearchSubmit().subscribe(async ({ term }: any) => {
      await this.router.navigate(["/functionality-search"], {
        queryParams: { term }
      });
    });
  }

  ngOnInit() {
    this.menuService.onItemClick().subscribe(({ item }) => {
      this.onItemSelection(item);
    });
    this.fetchUser();
  }

  toggle() {
    this.sidebarService.toggle(true);
  }

  expandSidebar() {
    this.sidebarService.expand();
  }

  onItemSelection({ title }) {
    if (title === "Sair") {
      this.logout();
    } else if (title === "Profile") {
    }
  }

  logout() {
    this.authService.logout();
  }

  fetchUser() {
    localStorage.tipoUsuario === 0
      ? (this.routerLogo = "/#/security/user-data")
      : (this.routerLogo = "/#/security/user-data");
    this.user.nome = localStorage.Name;
    this.user.login = localStorage.UserName;
    return (this.user = { ...this.user, ...localStorage });
  }
  redirecionaLogin() {
    this.router.navigate(["/security/user"]);
  }
}
