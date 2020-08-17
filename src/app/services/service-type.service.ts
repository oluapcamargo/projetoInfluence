import { ServerService } from "./server.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: "root"
})
export class ServiceTypeService {
  constructor(private http: HttpClient, private server: ServerService) {}

  getPhoto(url, nome) {
    return this.http.get(url, { responseType: "blob" }).subscribe(blob => {
      saveAs(blob, nome, {
        type: "text/plain;charset=windows-1252" // --> or whatever you need here
      });
    });
  }

  fetch(params) {
    return this.http.get<any>(
      this.server.url(`/TiposServico/getByFilterTipoServico`),
      { params }
    );
  }

  fetchTpPromocao(params) {
    return this.http.get<any>(
      this.server.url(`/TiposServico/getTipoServicoByFilterPromocao`),
      { params }
    );
  }
  fetchCombo() {
    return this.http.get<any>(
      this.server.url(`/TiposServico/getAllTipoServicoCombo`)
    );
  }

  fetchId(id: any) {
    return this.http.get<any>(this.server.url(`/TiposServico/${id}`));
  }

  update(data: any) {
    return this.http.put<any>(this.server.url(`/TiposServico/`), data);
  }

  save(params: any) {
    return this.http.post<any>(this.server.url(`/TiposServico/`), params);
  }

  delete(id: string) {
    return this.http.delete<any>(this.server.url(`/TiposServico/${id}`));
  }
}
