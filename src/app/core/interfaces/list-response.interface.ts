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
  total?: number;
  message: string[];
  statusCode?: number;
}

export interface IBlkBie {
  status: string;
  proceedingsNumber: number;
  goodNumber: number;
  screen: string;
}

export interface IQueryRegAdmin {
  allGst: string;
  delegatioGnu: number;
  recAdmGst: string;
}

export interface ICountDelivery {
  good: number | string;
  proceedingKey?: string;
}
