export class PromotionFilterType {
  titulo: string;
  dataInicioVigencia: string;
  dataFimVigencia: string;
  situacao: string;
  tipoPromocao: string;
  valorDescontoMinimo: string;
  valorDescontoMaximo: string;
  percentualDescontoMinimo: string;
  percentualDescontoMaximo: string;
  valorMinimoCompraMinimo: string;
  valorMinimoCompraMaximo: string;
  estado: string;
  municipio: string;
  bairro: string;
  codigoTipoServico: string;
  cNPJEstabelecimento: string;
  nomeEstabelecimento: string;
  take: number = 10;
  offset: number;
  sortingProp: string;
  ascending: boolean;
}
