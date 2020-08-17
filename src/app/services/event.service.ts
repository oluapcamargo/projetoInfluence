import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerService } from "./server.service";

@Injectable({
  providedIn: "root"
})
export class EventService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(params) {
    return this.http.get<any>(this.server.url(`/Evento`), { params });
  }
  fetchbyId(id) {
    return this.http.get<any>(this.server.url(`/Evento/ConsultarEvento/${id}`));
  }

  save(params) {
    return this.http.post<any>(
      this.server.url(`/Evento/CadastrarEvento`),
      params
    );
  }

  update(id, params) {
    return this.http.put<any>(this.server.url(`/Evento/Update/${id}`), params);
  }
  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/Evento/${id}`));
  }
  deleteInscrito(id: string) {
    return this.http.delete<any>(
      this.server.url(`/Evento/RemoverInscrito/${id}`)
    );
  }
}
