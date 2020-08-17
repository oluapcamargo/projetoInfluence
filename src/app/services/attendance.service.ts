import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(params) {
    return this.http.get<any>(this.server.url(`/Atendimento/Get`), { params });
  }
  fetchbyId(id) {
    return this.http.get<any>(this.server.url(`/Atendimento/GetById/${id}`));
  }
  fetchServicosbyId(id) {
    return this.http.get<any>(
      this.server.url(`/Atendimento/GetServicosById/${id}`)
    );
  }
  update(params) {
    return this.http.put<any>(this.server.url(`/Atendimento`), params);
  }
  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/Atendimento/${id}`));
  }

  removerTipoServicoAtendimento(id: string) {
    return this.http.delete<any>(
      this.server.url(`/Atendimento/RemoverTipoServicoAtendimento/${id}`)
    );
  }

  confirmarAtendimento(params) {
    return this.http.put<any>(
      this.server.url(`/Atendimento/ConfirmarAtendimento/`),
      params
    );
  }
  cancelarAtendimento(params) {
    return this.http.put<any>(
      this.server.url(`/Atendimento/CancelarAtendimento`),
      params
    );
  }
}
