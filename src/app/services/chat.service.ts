import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch(id) {
    return this.http.get<any>(this.server.url(`/Chat/${id}`));
  }
  send(id, params) {
    return this.http.post<any>(
      this.server.url(`/Chat?atendimentoId=${id}`),
      params
    );
  }
}
