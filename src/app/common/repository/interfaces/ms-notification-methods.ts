import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ListParams } from './list-params';

export interface IRead<T> {
  getAll?(route: string, params?: ListParams): Observable<IListResponse<T>>;
  getByNotificationxProperty?(
    route: string,
    params?: ListParams
  ): Observable<IListResponse<T>>;
  updateNotification?(
    route: string,
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: Object
  ): Observable<Object>;

  getByReference?(route: string, id: number | string): Observable<T>;
  getStatus?(route: string, id: number | string): Observable<T>;
  getFlag?(route: string, id: number | string): Observable<T>;
  getDescription?(route: string, id: number | string): Observable<T>;
}

export interface IWrite<T> {
  create?(route: string, model: T): Observable<T>;
  update?(route: string, id: number | string, model: T): Observable<Object>;
  remove?(route: string, id: number | string): Observable<Object>;
}

export interface INotificationMethods<T> extends IWrite<T>, IRead<T> {}
