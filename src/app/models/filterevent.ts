export class EventFilterType {
  nome: string;
  situacao: string;
  dataInicio: string;
  dataFim: string;
  cNPJEstabelecimento: string;
  nomeEstabelecimento: string;
  valorInscricaoInicial: string;
  valorInscricaoMaximo: string;
  dataInicioInscricao: string;
  dataFimInscricao: string;
  quantidadeInscritosMinimo: string;
  quantidadeInscritosMaximo: string;
  cPFdoInscrito: string;
  nomedoInscrito: string;
  uf: string;
  municipio: string;
  bairro: string;
  take: number = 10;
  offset: number;
  sortingProp: string;
  ascending: boolean;
}
