export class TipoServicoFilterType {
  nome: string;
  categoriaCodigo: string;
  situacao: string;
  take: number = 10;
  offset: number;
  sortingProp: string;
  ascending: boolean;
}
