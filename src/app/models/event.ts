import { EventPhotoType } from "./eventPhoto";

export class EventType {
  id: string;
  nome: string;
  situacao: string;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  dataInicioInscricao: string;
  dataFimInscricao: string;
  codigoEstabelecimento: string;
  codigoEstado: string;
  codigoMunicipio: string;
  codigoBairro: string;
  valorInscricao: string;
  quantidadeVagas: string;
  descricao: string;
  cEP: string;
  fotoCapa: string;
  rua: string;
  numeroEndereco: string;
  complementoEndereco: string;
  nomeFoto: string;
  caminhoFoto: string;
  tipoFoto: string;
  nomePanfleto: string;
  foto: string;
  caminhoPanfleto: string;
  tipoPanfleto: string;
  fotos: EventPhotoType[];
}
