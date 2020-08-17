import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
let UserService = class UserService {
  constructor(http, server) {
    this.http = http;
    this.server = server;
  }
  fetch(code) {
    return this.http.get(this.server.url(`/Usuario?EmpresaId=${code}`));
  }
  update({ valor, id }) {
    return this.http.put(
      this.server.url(`/ScoreParametro/configuracao-parametrosPeso/${id}`),
      { valor }
    );
  }
  save(params) {
    return this.http.post(this.server.url(`/Usuario`), params);
  }
  updateUser(params, id) {
    return this.http.put(this.server.url(`/Usuario/${id}`), params);
  }
  deleteUser(params, id) {
    return this.http.delete(this.server.url(`/Usuario/${id}`), params);
  }

  fetchUserById(id) {
    return this.http.get(this.server.url(`/Usuario/${id}`));
  }
  fetchPermissions(id) {
    return this.http.get(this.server.url(`/Usuario/${id}/permissoes`));
  }
  allPermissions() {
    return this.http.get(this.server.url(`/Dominio/EnumPermissao`));
  }
};
UserService = __decorate(
  [
    Injectable({
      providedIn: "root"
    })
  ],
  UserService
);
export { UserService };
//# sourceMappingURL=user.service.js.map
