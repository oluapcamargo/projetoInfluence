export class AttendaceFilterType {
  dataInicio: Date;
  dataFim: Date;
  horaInicio: string;
  horaFim: string;
  formaPagamento: string;
  situacao: number;
  cNPJEstabelecimento: string;
  nomeEstabelecimento: string;
  cPFCliente: string;
  nomeCliente: string;
  tipoServico: string;
  estado: string;
  municipio: string;
  bairro: string;
  take: number = 10;
  offset: number;
  sortingProp: string;
  ascending: boolean;
}
