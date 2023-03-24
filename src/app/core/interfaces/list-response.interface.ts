export interface IListResponse<T = any> {
  [x: string]: any;
  lenght(arg0: string, lenght: any): unknown;
  data: T[];
  count: number;
  message: T[];
  statusCode: number;
}
