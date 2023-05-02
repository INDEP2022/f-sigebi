import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ListParams } from './list-params';

export interface IRead<T> {
  getAll?(
    route: string,
    params?: ListParams,
    filter?: string
  ): Observable<IListResponse<T>>;
  getById?(route: string, id: number | string): Observable<T>;
}

export interface IWrite<T> {
  create?(route: string, model: T): Observable<IListResponse<T>>;
  update?(
    route: string,
    id: number | string,
    model: T
  ): Observable<IListResponse<T>>;
  remove?(route: string, id: number | string): Observable<T>;
}

export interface IInventortQueryMethods<T> extends IWrite<T>, IRead<T> {}
