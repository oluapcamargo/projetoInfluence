import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerService } from "./server.service";

@Injectable({
  providedIn: "root"
})
export class PromotionsService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(param) {
    return this.http.get<any>(this.server.url(`/Promocao/Get`), {
      params: param
    });
  }

  save(params) {
    return this.http.post<any>(this.server.url(`/Promocao`), params);
  }

  update(params) {
    return this.http.put<any>(this.server.url(`/Promocao`), params);
  }
  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/Promocao/${id}`));
  }

  deleteEstabelecimento(id: string) {
    return this.http.delete<any>(
      this.server.url(`/Promocao/Estabelecimento/${id}`)
    );
  }
  deleteCliente(id: string) {
    return this.http.delete<any>(this.server.url(`/Promocao/Cliente/${id}`));
  }
}
