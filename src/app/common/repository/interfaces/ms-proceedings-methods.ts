import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';

export interface IRead<T> {
  getActByFileNumber(
    route: string,
    fileNumber: number
  ): Observable<IListResponse<T>>;
}

export interface IWrite<T> {
  create?(route: string, model: T): Observable<T>;
  update?(route: string, id: number | string, model: T): Observable<Object>;
  remove?(route: string, id: number | string): Observable<Object>;
}

export interface IProceedingsMethods<T> extends IWrite<T>, IRead<T> {}
