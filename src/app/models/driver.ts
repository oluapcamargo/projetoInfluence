import { CNH } from './cnh'
import { Certificate } from './certificate'

export class Driver {
  id: string
  alturaAtual: string
  anexos: []
  anoFabricacao: number
  certidoes = new Array<Certificate>()
  cnh = new CNH()
  cpf: string
  dataAdmissao: any
  dataNascimento: Date
  empresaId: string
  especie: number
  estadoCivil: string
  nome: string
  pesoAtual: number
  pesoDoisAnosAtras: number
  pontuacaoCNH: number
  possuiDebitosSituacaoFiscal: boolean
  possuiMandadoPrisaoOuAntecendentesCriminais: boolean
  possuiSancoesOuRestricoes: boolean
  scoreCadastro: number
  scoreGeral: number
  situacaoCadastral: string
  statusANTT_SISHAB: number
}
