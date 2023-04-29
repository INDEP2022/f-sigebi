export interface IListResponse<T = any> {
  [x: string]: any;
  lenght(arg0: string, lenght: any): unknown;
  data: T[];
  count: number;
  message: T[];
  statusCode: number;
}

export interface IResponse<T = any> {
  [x: string]: any;
  lenght(arg0: string, lenght: any): unknown;
  data?: T;
  count?: number;
  message: string[];
  statusCode: number;
}

export interface IListResponseMessage<T = any> {
  [x: string]: any;
  data: T[];
  count: number;
  message: string[];
  statusCode?: number;
}
