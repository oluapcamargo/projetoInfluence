export class FilterStore {
  nome: string;
  email: string;
  telefone: string;
  pageSize: number = 10;
  pageNumber: number;
  sortingProp: string;
  OrdenacaoDesc: boolean;
}
