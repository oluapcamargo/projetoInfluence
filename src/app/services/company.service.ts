import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Operator } from "../models/operator";
import { ServerService } from "./server.service";

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetchCompany(id: string) {
    // return this.http.get<any>(this.server.url(`/Empresa/${id}`))
  }

  fetch(status?: string) {
    if (status) {
      return this.http.get<any>(this.server.url(`/Empresa?Situacao=${status}`));
    } else {
      return this.http.get<any>(this.server.url(`/Empresa`));
    }
  }

  fetchDrivers(id: string) {
    return this.http.get<any>(
      this.server.url(`/Score/empresa/${id}/motoristas`)
    );
  }

  fetchCompanySizes() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumEmpresaPorte`));
  }

  fetchAnttStatus() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumStatusANTT`));
  }

  update(params: any, id: string) {
    // return this.http.put<any>(this.server.url(`/Empresa/${id}`), params)
  }

  save(params: any) {
    // return this.http.post<any>(this.server.url(`/Empresa`), params)
  }

  updateAnualHistory(params: any, id: string) {
    // return this.http.post<any>(
    //   this.server.url(`/Empresa/${id}/historicos-anual`),
    //   params
    // )
  }

  deleteAnualHistory(id: string) {
    return this.http.delete<any>(
      this.server.url(`/Empresa/historicos-anual/${id}`)
    );
  }

  saveConstituicaoSocietaria(params: any, id: string) {
    return this.http.post<any>(
      this.server.url(`/Empresa/${id}/constituicoes-societaria`),
      params
    );
  }

  updateCert(params: any, id: string) {
    return this.http.put<any>(
      this.server.url(`/Empresa/certidoes/${id}`),
      params
    );
  }

  saveCert(params: any, id: string) {
    return this.http.post<any>(
      this.server.url(`/Empresa/${id}/certidoes`),
      params
    );
  }

  updateContact(params: { telefone: any; email: any }, id: any) {
    return this.http.put<any>(
      this.server.url(`/Empresa/contatos/${id}`),
      params
    );
  }

  saveContact(
    params: { telefone: any; email: any; empresaId: string },
    id: string
  ) {
    return this.http.post<any>(
      this.server.url(`/Empresa/${id}/contatos`),
      params
    );
  }

  updateResponsable(params: { nome: any; cpf: any }, id: any) {
    return this.http.put<any>(
      this.server.url(`/Empresa/responsaveis/${id}`),
      params
    );
  }

  saveResponsable(
    params: { nome: any; cpf: string; empresaId: string },
    id: string
  ) {
    return this.http.post<any>(
      this.server.url(`/Empresa/${id}/responsaveis`),
      params
    );
  }

  deleteCert(id: string) {
    return this.http.delete<any>(this.server.url(`/Empresa/certidoes/${id}`));
  }

  savePreRegister(id: string, params: Operator) {
    return this.http.post<any>(
      this.server.url(`/Empresa/pre-cadastro`),
      params
    );
  }
}
