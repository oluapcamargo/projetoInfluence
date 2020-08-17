import { Certificate } from './certificate'

export class Vehicle {
  empresaId: string
  placa: string
  emplacamentoUF: string
  numeroChassis: string
  marcaChassis: string
  marcaCarroceria: string
  modeloCarroceria: string
  renavam: string
  anoFabricacao: number
  especie: number
  numeroEixosTraseiro: number
  numeroEixosDianteiro: number
  numeroPisos: number
  statusANTT_SISHAB: number
  possuiAcessibilidade: boolean
  possuiRestricaoJudicial: boolean
  possuiSistemaTelemetria: boolean
  possuiSistemaMonitoramento: boolean
  possuiCarroceriaTipoDDouLD: boolean
  certidoes: Certificate[]
  constructor() {}
}
