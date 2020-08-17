import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, take, retry, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { AlertService } from "./alert.service";
import { Router } from "@angular/router";
import { Util } from "../utils/util";
import { APIResponse } from "../models/requests";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private alert: AlertService,
    private router: Router,
    private util: Util
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Cria um clone da requisição, adicionando os cabeçarios necessários
    const dupReq = req.clone({
      headers: req.headers.set(
        "Authorization",
        `Bearer ${this.authService.getToken()}`
      ),
      params: this.util.removeNullValuesFromQueryParams(req.params)
    });

    // Retorna e da prosseguimento com a requisição configurada
    return next.handle(dupReq).pipe(
      tap(response => this.handleResponse(response)),
      catchError((error: HttpErrorResponse) => {
        const { status } = error;
        if (status === 401) {
          return this.handleResponse401();
        } else if (status === 403) {
          return this.handleResponse403();
        } else {
          return this.handleErrorsWithGenericResponse(error);
        }
      })
    );
    // }
  }

  async tryToAuthorize(): Promise<boolean> {
    const { value } = await this.authService
      .refreshToken()
      .pipe(take(1))
      .toPromise();
    const { token } = value;

    if (token) {
      localStorage.setItem("access-token", token.accessToken);
      localStorage.setItem("refresh-token", token.refreshToken);
    }

    return value.authenticated ? true : false;
  }

  handleResponse(response: any) {
    if (response && response instanceof HttpResponse) {
      const status = response.status;
      const body = response.body as APIResponse;
      if (status === 200 && body && body.errors && body.errors.length) {
        this.handleResponse200WithError(response.body);
      }
    }
  }

  handleResponse200WithError(body: APIResponse) {
    this.alert.error(body.errors[0]);
  }

  handleResponse401() {
    const token = localStorage.getItem("access-token");
    if (!token) {
      this.alert.warning("Você será redirecionado para o login.");
      setTimeout(() => this.router.navigate(["/login"]), 3000);
      return throwError("Usuário sem TOKEN");
    }
    this.tryToAuthorize().then(authorized => {
      if (authorized) {
        this.authService.loggedIn.next(true);
        location.reload();
      } else {
        this.alert.warning("Seu token expirou. É necessário re-fazer o login.");
        this.authService.logout();
        return throwError("Token Expirado");
      }
    });
  }

  handleResponse403() {
    const erro = new HttpErrorResponse({
      error: "Sem permissão para realizar esta ação",
      status: 403
    });
    this.handleErrorsWithGenericResponse(erro);
    return throwError("Sem permissão");
  }

  handleErrorsWithGenericResponse(error: HttpErrorResponse) {
    const arrayOfErrors = error.error?.errors;
    if (arrayOfErrors) {
      if (Array.isArray(arrayOfErrors) && arrayOfErrors.length) {
        arrayOfErrors.forEach(problemMessage =>
          this.alert.error(problemMessage)
        );
      } else if (Object.getOwnPropertyNames(arrayOfErrors).length > 0) {
        Object.getOwnPropertyNames(arrayOfErrors).forEach(propOfError =>
          this.alert.error(arrayOfErrors[propOfError])
        );
      }
    } else {
      this.alert.error(
        typeof error.error === typeof ""
          ? error.error
          : "Verifique sua conexão e tente novamente.",
        "Ocorreu um erro sem tratamento"
      );
    }

    return throwError(error);
  }
}
