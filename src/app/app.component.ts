import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { CurrentUserService } from "./services/current-user.service";
import { SignalRService } from "./services/signal-r.service";
import { HttpClient } from "@angular/common/http";

import { Router } from "@angular/router";
import {
  NbSidebarService,
  NbMediaBreakpointsService,
  NbMediaBreakpoint
} from "@nebular/theme";
import { maxBy } from "lodash";
export * from "@angular/material/icon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "rsp-backoffice";
  isAuthenticated = false;
  breakpoints: NbMediaBreakpoint[];
  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: NbSidebarService,
    public signalRService: SignalRService,
    private http: HttpClient,
    private bpService: NbMediaBreakpointsService
  ) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.isAuthenticated = loggedIn;
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  ngOnInit() {
    this.breakpoints = this.bpService.getBreakpoints();
    // this.signalRService.startConnection();
    // this.signalRService.addTransferChartDataListener();
    // this.startHttpRequest();
  }

  expandSidebar() {
    this.sidebarService.expand();
  }

  // private startHttpRequest = () => {
  //   this.http
  //     .get("http://srv-dev-01.globalsys.corp:2013/api/Chat")
  //     .subscribe(res => {
  //       console.log(res);
  //     });
  // };

  compactSidebar() {
    const possibleBreakpoints = this.breakpoints.filter(
      bp => bp.width <= window.screen.width
    );
    const currentBreakpoint = maxBy(possibleBreakpoints, bp => bp.width);
    if (
      currentBreakpoint &&
      ["xs", "is", "sm"].includes(currentBreakpoint.name)
    ) {
      this.sidebarService.collapse();
    } else {
      this.sidebarService.compact();
    }
  }
}
