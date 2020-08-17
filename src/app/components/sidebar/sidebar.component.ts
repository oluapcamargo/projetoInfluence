import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbMenuItem, NbMenuService, NbSidebarService } from "@nebular/theme";
import { CurrentUserService } from "../../services/current-user.service";
import { takeWhile } from "rxjs/operators";
import { Util } from "../../utils/util";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private isAlive = true;
  private person: any;
  selectedItem: string;
  items: NbMenuItem[];
  constructor(
    private menuService: NbMenuService,
    private util: Util,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.menuService
      .onItemClick()
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(({ item }) => {
        this.resetSelectedItem(item.link);
      });

    const personOnStorage = localStorage.getItem("person");
    this.person = personOnStorage ? JSON.parse(atob(personOnStorage)) : null;
    this.setRegisterMenu();
  }

  resetSelectedItem(route: string) {
    this.items.forEach(item => {
      const { children } = item;
      if (children) {
        children.forEach((child: any) => {
          child.selected = route === child.link ? true : false;
        });
      }
    });
  }

  setRegisterMenu() {
    this.items = this.getRegisterMenu();
  }
  getRegisterMenu() {
    const permissions = this.currentUserService.getPermissionsFromStorage();
    const menu: NbMenuItem[] = [
      {
        title: "Dashboard",
        pathMatch: "prefix",
        icon: "pie-chart-outline",
        link: "/dashboard"
        // hidden: !permissions.some(
        //   e =>
        //     e.nome ===
        //     this.currentUserService.getEnumPermissions().ConsultarDashboard
        // )
      },
      {
        title: "Cadastro",
        icon: "file-add-outline",
        pathMatch: "prefix",
        link: "/register",
        // hidden: !permissions.some(
        //   e =>
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions()
        //         .ConsultarAtendimento ||
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions()
        //         .ConsultarEstabelecimento ||
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions()
        //         .ConsultarEstabelecimento ||
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions().ConsultarEvento ||
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions().ConsultarPromocao ||
        //     e.nome ===
        //       this.currentUserService.getEnumPermissions().ConsultarTipoServico
        // ),
        children: [
          //   {
          //     title: "Atendimento",
          //     link: "attendance",
          //     selected: false,
          //     hidden: !permissions.some(
          //       e =>
          //         e.nome ===
          //         this.currentUserService.getEnumPermissions()
          //           .ConsultarAtendimento
          //     )
          //   },
          //   {
          //     title: "Estabelecimentos",
          //     pathMatch: "full",
          //     link: "/register/store",
          //     selected: false,
          //     hidden: !permissions.some(
          //       e =>
          //         e.nome ===
          //         this.currentUserService.getEnumPermissions()
          //           .ConsultarEstabelecimento
          //     )
          //   },
          {
            title: "Planos de Pagamentos",
            pathMatch: "full",
            link: "/register/event",
            selected: false
            // hidden: !permissions.some(
            //   e =>
            //     e.nome ===
            //     this.currentUserService.getEnumPermissions().ConsultarEvento
            // )
          },
          {
            title: "Influenciador",
            pathMatch: "full",
            link: "/register/influenciador",
            selected: false
            // hidden: !permissions.some(
            //   e =>
            //     e.nome ===
            //     this.currentUserService.getEnumPermissions().ConsultarPromocao
            // )
          },
          {
            title: "Empresa",
            pathMatch: "full",
            link: "/register/store",
            selected: false
            // hidden: !permissions.some(
            //   e =>
            //     e.nome ===
            //     this.currentUserService.getEnumPermissions()
            //       .ConsultarTipoServico
            // )
          }
        ]
      },
      {
        title: "Segurança",
        icon: "lock-outline",
        link: "/security",
        pathMatch: "prefix",
        hidden: !permissions.some(
          e =>
            e.nome ===
              this.currentUserService.getEnumPermissions().ConsultarUsuario ||
            e.nome ===
              this.currentUserService.getEnumPermissions().ConsultarGrupo ||
            e.nome ===
              this.currentUserService.getEnumPermissions()
                .ConsultarPermissaoGrupo
        ),
        children: [
          {
            title: "Usuário",
            pathMatch: "full",
            link: "/security/user",
            selected: false,
            hidden: !permissions.some(
              e =>
                e.nome ===
                this.currentUserService.getEnumPermissions().ConsultarUsuario
            )
          }
          // ,
          // {
          //   title: "Grupo",
          //   pathMatch: "full",
          //   link: "/security/group",
          //   selected: false,
          //   hidden: !permissions.some(
          //     e =>
          //       e.nome ===
          //       this.currentUserService.getEnumPermissions().ConsultarGrupo
          //   )
          // },
          // {
          //   title: "Permissões do grupo",
          //   pathMatch: "full",
          //   link: "/security/group-permission",
          //   selected: false,
          //   hidden: !permissions.some(
          //     e =>
          //       e.nome ===
          //       this.currentUserService.getEnumPermissions()
          //         .ConsultarPermissaoGrupo
          //   )
          // }
        ]
      },

      {
        title: "Meus Dados",
        icon: "file-text-outline",
        children: [
          {
            title: "Dados do Usuário",
            link: "security/user-data",
            selected: false
          },
          {
            title: "Trocar Senha",
            link: "security/change-user-password",
            selected: false
          }
        ]
      }
    ];
    return menu;
  }
  // this.setDashboard(this.person.value);

  // const menu = this.getRegisterMenu(this.person.value.grupo.id);
  // this.items.find(a => a.title === "Cadastros").children.push(...menu);

  // setDashboard({ tipoUsuario }) {
  //   this.items = tipoUsuario
  //     ? this.items
  //     : this.items.filter(item => item.title !== "Dashboard");
  // }

  // getRegisterMenu({ tipoUsuario }): NbMenuItem[] {
  //   const operationMenu = [
  //     {
  //       title: "Empresas",
  //       link: "register/company",
  //       selected: false
  //     },
  //     {
  //       title: "Motoristas",
  //       link: "register/driver",
  //       selected: false
  //     },
  //     {
  //       title: "Veículos",
  //       link: "register/vechicle",
  //       selected: false
  //     }
  //   ];

  //   const operatorMenu = [
  //     {
  //       title: "Empresas",
  //       link: "operator/register-company",
  //       selected: false
  //     },
  //     {
  //       title: "Motoristas",
  //       link: "operator/register-driver",
  //       selected: false
  //     },
  //     {
  //       title: "Veículos",
  //       link: "operator/register-vehicle",
  //       selected: false
  //     }
  //   ];

  //   const clienteMenu = [
  //     {
  //       title: "Empresas",
  //       link: "operator/register-company",
  //       selected: false
  //     },
  //     {
  //       title: "Motoristas",
  //       link: "operator/register-driver",
  //       selected: false
  //     },
  //     {
  //       title: "Veículos",
  //       link: "operator/register-vehicle",
  //       selected: false
  //     }
  //   ];

  //   return tipoUsuario ? operationMenu : operatorMenu;
  // }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
