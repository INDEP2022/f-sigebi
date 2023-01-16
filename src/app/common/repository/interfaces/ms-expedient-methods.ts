import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';

export interface IRead<T> {
  //TODO: ADD NEWS METHODS
  getById?(route: string, id: number | string): Observable<IListResponse<T>>;
}

export interface IWrite<T> {}

export interface IExpedientMethods<T> extends IWrite<T>, IRead<T> {}
