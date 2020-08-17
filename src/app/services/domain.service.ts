import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ServerService } from './server.service'

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  constructor(private http: HttpClient, private server: ServerService) {}

  fetchAnttStatus() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumStatusANTT`))
  }

  fetchEnumStatusANTT_SISHAB() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumStatusANTT_SISHAB`))
  }

  fetchEnumMotoristaSituacaoCadastral() {
    return this.http.get<any>(
      this.server.url(`/Dominio/EnumMotoristaSituacaoCadastral`)
    )
  }

  fetchEnumMotoristaCertidao() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumMotoristaCertidao`))
  }

  fetchEnumCategoriaHabilitacao() {
    return this.http.get<any>(
      this.server.url(`/Dominio/EnumCategoriaHabilitacao`)
    )
  }

  fetchCivilStatus() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumEstadoCivil`))
  }

  fetchEnumVeiculoEspecie() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumVeiculoEspecie`))
  }

  fetchVehicleEnumCert() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumVeiculoCertidao`))
  }

  fetchPermissions() {
    return this.http.get<any>(this.server.url(`/Login/permissoes`))
  }

  fetchCompanyCerts() {
    return this.http.get<any>(this.server.url(`/Dominio/EnumEmpresaCertidao`))
  }
}
