import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerService } from "./server.service";
import { PreStoreType } from "../models/prestore";
import { FilterStore } from "../models/filtersstore";
import { APIResponse } from "../models/requests";

@Injectable({
  providedIn: "root"
})
export class StoreService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(params) {
    return this.http.get<any>(
      this.server.url(`/Estabelecimento/ConsultarEstabelecimento`),
      { params }
    );
  }

  fetchTable(params) {
    return this.http.get<any>(this.server.url(`/Usuario/ListarUsuarios`), {
      params
    });
  }

  fetchEstabPromoTab(params) {
    return this.http.get<any>(this.server.url(`/Estabelecimento/PromocaoGet`), {
      params
    });
  }

  fetchByEstabId(id) {
    return this.http.get<APIResponse>(
      this.server.url(`/Estabelecimento/ConsultarById/${id}`)
    );
  }

  fetchById(id) {
    return this.http.get<any>(
      this.server.url(`/Estabelecimento/GetById/${id}`)
    );
  }

  save(params: any) {
    return this.http.post<any>(this.server.url(`/Estabelecimento/`), params);
  }

  savePreCadastro(params: any) {
    return this.http.post<any>(
      this.server.url(`/Estabelecimento/preCadastro`),
      params
    );
  }

  update(id, params) {
    return this.http.put<any>(
      this.server.url(`/Estabelecimento/Update/${id}`),
      params
    );
  }

  updateSituacao(id, params) {
    return this.http.put<any>(
      this.server.url(`/Estabelecimento/UpdateSituacao/${id}`),
      params
    );
  }

  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/Estabelecimento/${id}`));
  }
}
