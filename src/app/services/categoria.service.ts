import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CategoriaService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetch() {
    return this.http.get<any>(this.server.url(`/Categoria`));
  }
}
