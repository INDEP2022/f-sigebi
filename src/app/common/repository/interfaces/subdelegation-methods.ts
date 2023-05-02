import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ListParams } from './list-params';
export interface IRead<T> {
  getAll?(route: string, params?: ListParams): Observable<IListResponse<T>>;
}

export interface IWrite<T> {
  create?(model: T): Observable<T>;
  update?(id: number | string, model: T): Observable<Object>;
  remove?(id: number | string): Observable<Object>;
}

export interface ISubDelegationMethods<T> extends IWrite<T>, IRead<T> {}
