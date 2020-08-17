import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerService } from "./server.service";

@Injectable({
  providedIn: "root"
})
export class GroupService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch() {
    return this.http.get<any>(this.server.url(`/Grupo`));
  }
  fetchGrupos(params) {
    return this.http.get<any>(this.server.url(`/Grupo/`), { params });
  }
  save(params) {
    return this.http.post<any>(this.server.url(`/Grupo`), params);
  }

  update(id, params) {
    return this.http.put<any>(this.server.url(`/Grupo/${id}`), params);
  }
  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/Grupo/${id}`));
  }
  fetchGroupPermissions(id) {
    return this.http.get<any>(this.server.url(`/Grupo/${id}/Permissoes`));
  }

  fetchPermissions(id) {
    return this.http.get<any>(this.server.url(`/PermissaoGrupo/${id}`));
  }

  savePermission(params) {
    return this.http.post<any>(this.server.url(`/PermissaoGrupo`), params);
  }

  deletePermission(id: string) {
    return this.http.delete<any>(this.server.url(`/PermissaoGrupo/${id}`));
  }
}
