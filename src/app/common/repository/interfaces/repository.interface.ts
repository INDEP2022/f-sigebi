import { Observable } from 'rxjs';
import { IListResponse } from '../../../core/interfaces/list-response.interface';
import { ListParams } from './list-params';

export interface IRead<T> {
  getById(route: string, id: number | string): Observable<T>;
  getAllPaginated(
    route: string,
    params?: ListParams
  ): Observable<IListResponse<T>>;
}

export interface IWrite<T> {
  create(route: string, model: T): Observable<T>;
  update(route: string, id: number | string, model: T): Observable<Object>;
  remove(route: string, id: number | string): Observable<Object>;
}

export interface IRepository<T> extends IWrite<T>, IRead<T> {}
