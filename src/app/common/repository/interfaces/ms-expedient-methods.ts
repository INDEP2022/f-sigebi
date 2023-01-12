import { Observable } from 'rxjs';

export interface IRead<T> {
  //TODO: ADD NEWS METHODS
  getById?(route: string, id: number | string): Observable<T>;
}

export interface IWrite<T> {}

export interface IExpedientMethods<T> extends IWrite<T>, IRead<T> {}
