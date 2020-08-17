export class CNH {
  id: string
  numero: string
  validade: Date
  renarch: string
  categoria: string
  uf: string
  dataPrimeiraHabilitacao: Date
  file: File
  urlAnexo: string
  constructor(numero = '') {
    this.numero = numero
  }
}
