import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as jwt_decode from "jwt-decode";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private server: ServerService
  ) {
    this.loggedIn.next(this.getToken() ? true : false);
  }

  getToken(): string {
    return localStorage.getItem("access-token");
  }

  logIn(
    email: string,
    password: string,
    captchaId?: string,
    resultado?: number
  ) {
    return this.http
      .post<any>(this.server.url("/Login"), {
        email: email,
        senha: password,
        captchaId,
        resultado
      })
      .pipe(catchError(this.server.handleError));
  }

  signUp(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.server.url("/register"), {
        email,
        password
      })
      .pipe(catchError(this.server.handleError));
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.clear();
    setTimeout(() => window.location.reload(), 3000);
  }

  decode() {
    let token = { sid: "", Id: "" };
    if (this.getToken()) {
      token = jwt_decode(this.getToken());
      return token;
    }
    return token;
  }

  changePassword(params: any) {
    return this.http
      .post<any>(this.server.url("/Usuario/EsqueciSenha"), params)
      .pipe(catchError(this.server.handleError));
  }

  updatePassword(params: any) {
    return this.http
      .post<any>(this.server.url("/Usuario/AlterarSenha"), params)
      .pipe(catchError(this.server.handleError));
  }

  getIp() {
    return this.http.get<any>("http://api.ipify.org/?format=json");
  }

  refreshToken() {
    const { Id } = this.decode();
    const refreshToken = localStorage.getItem("refresh-token");

    return this.http
      .post<any>(this.server.url("/Login"), {
        userName: Id,
        password: refreshToken,
        grantTypes: "refresh_token"
      })
      .pipe(catchError(this.server.handleError));
  }
}
