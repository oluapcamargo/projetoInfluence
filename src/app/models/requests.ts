export interface APIResponse {
  value: any;
  count: number;
  hasSuccess: boolean;
  hasError: boolean;
  errors: any;
  httpStatusCode: string;
}
