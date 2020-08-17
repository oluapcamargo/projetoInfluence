import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(code: string) {
    return this.http.get<any>(this.server.url(`/Usuario/`));
  }
  fetchUser(params) {
    return this.http.get<any>(
      this.server.url(`/Usuario/ConsultarUsuarioBackOffice`),
      { params }
    );
  }
  update({ valor, id }) {
    return this.http.put<any>(
      this.server.url(`/ScoreParametro/configuracao-parametrosPeso/${id}`),
      { valor }
    );
  }

  save(params) {
    return this.http.post<any>(this.server.url(`/Usuario/`), params);
  }

  updateUser(params, id) {
    return this.http.put<any>(this.server.url(`/Usuario/Update/${id}`), params);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(this.server.url(`/Usuario/${id}`));
  }

  fetchUserById(id: string) {
    return this.http.get<any>(this.server.url(`/Usuario/${id}`));
  }

  fetchPermissions(id: string) {
    return this.http.get<any>(this.server.url(`/Usuario/${id}/permissoes`));
  }

  allPermissions() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumPermissao`));
  }

  userTypes() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumTipoUsuario`));
  }

  savePermission(params) {
    return this.http.post<any>(this.server.url(`/PermissaoUsuario`), params);
  }

  deletePermission(id: string) {
    return this.http.delete<any>(this.server.url(`/PermissaoUsuario/${id}`));
  }
}
