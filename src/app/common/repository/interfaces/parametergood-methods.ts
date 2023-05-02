import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ListParams } from './list-params';
export interface IRead<T> {
  getAll?(route: string, params?: ListParams): Observable<IListResponse<T>>;
  getById?(route: string, id: number | string): Observable<T>;
  getByLogicalTables?(
    route: string,
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<T>>;
}

export interface IWrite<T> {
  create?(route: string, model: T): Observable<T>;
  update?(route: string, id: number | string, model: T): Observable<Object>;
  remove?(route: string, id: number | string): Observable<Object>;
}

export interface IParametergoodMethods<T> extends IWrite<T>, IRead<T> {}
