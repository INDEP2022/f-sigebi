import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { FilterParams, ListParams } from './list-params';

export interface IRead<T> {
  getById?(id: number | string): Observable<T>;
  getById3?(id: number | string): Observable<IListResponse<T>>;
  getById4?(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<T>>;
  getAll?(
    params?: ListParams | FilterParams | string
  ): Observable<IListResponse<T>>;
  getByIds?(ids: Partial<T>): Observable<T>;
  postByIds?(model: T): Observable<IListResponse<T>>;
  postColumns?(model: T): Observable<IListResponse<T>>;
}

export interface IWrite<T> {
  create?(model: T): Observable<T>;
  update?(id: number | string, model: T): Observable<Object>;
  remove?(id: number | string): Observable<Object>;
  updateByIds?(ids: Partial<T>, model: T): Observable<Object>;
  removeByIds?(ids: Partial<T>): Observable<Object>;
}

export interface ICrudMethods<T> extends IWrite<T>, IRead<T> {}
