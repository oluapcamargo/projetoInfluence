import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpEvent } from "@angular/common/http";
import { ServerService } from "./server.service";
import { saveAs } from "file-saver";
import { APIResponse } from "../models/requests";

@Injectable({
  providedIn: "root"
})
export class UtilService {
  constructor(private http: HttpClient, private server: ServerService) {}

  UF() {
    return this.http.get<APIResponse>(this.server.url(`/Util`));
  }

  Municipio(id: any) {
    return this.http.get<APIResponse>(
      this.server.url(`/Util/GetMunicipios/${id}`)
    );
  }

  Bairro(id: any) {
    return this.http.get<APIResponse>(this.server.url(`/Util/GetBairro/${id}`));
  }
  getTaxaPadrao(parametro: any) {
    return this.http.get<string>(
      this.server.url(`/Util/GetParametroSistema/${parametro}`)
    );
  }
  getPhoto(url, nome) {
    return this.http.get(url, { responseType: "blob" }).subscribe(blob => {
      saveAs(blob, nome, {
        type: "text/plain;charset=windows-1252" // --> or whatever you need here
      });
    });
  }
}
