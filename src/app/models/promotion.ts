import { UFType } from "./uf";
import { MunicipioType } from "./municipio";
import { BairroType } from "./bairro";

export class PromotionType {
  id: string;
  descricao: string;
  dataInicioVigencia: Date;
  dataFimVigencia: Date;
  situacao: boolean;
  situacaoString: string;
  descricaoSubtitulo: string;
  tipo: string; // Tipo da promoção: 0 - Valor 1 - Percentual de Desconto
  valor: number;
  percentualDesconto: number;
  valorMinimoCompra: string;
  quantidadeMaximaCupons: string;
  quantidadeMinimaDiasSemCompra: number;
  quantidadeCuponsUtilizados: number;
  valorTotalArrecadadoCupom: string;
  quantidadeMaximaDiasSemCompra: string;
  flagUsouCupom: boolean; //Regra para enquadramento do cliente: Indicativo de que o cliente já usou cupom:  - 0 - Não  - 1 - Sim
  numeroMinimoComprasRealizadas: number;
  numeroMaximoComprasRealizadas: number;
  valorMinimoComprasRealizadas: number;
  valorMaximoComprasRealizadas: number;
  idadeMinima: number;
  idadeMaxima: number;
  estadoId: string;
  municipioId: string = "";
  flagTodosCliente: boolean;
  estabelecimentos: string[];
  tipoServicos: string[];
}
