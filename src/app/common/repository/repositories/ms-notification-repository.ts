import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { INotificationTransferentIndiciadoCity } from 'src/app/core/models/ms-notification/notification.model';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { INotificationMethods } from '../interfaces/ms-notification-methods';

@Injectable({ providedIn: 'root' })
export class NotificationRepository<T> implements INotificationMethods<T> {
  ms: string = `${environment.API_URL}notification/api/v1`;

  constructor(public readonly httpClient: HttpClient) {}

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getByNotificationxProperty(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getByExpedient?(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}${id}`);
  }

  updateNotification(
    route: string,
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: Object
  ) {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.put(
      `${fullRoute}/${numberProperty}/notification/${notificationDate}`,
      formData
    );
  }

  create(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    console.log(fullRoute);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }

  private buildRoute(route: string) {
    const paths = route.split('/');
    paths.shift();
    if (paths.length === 0) {
      return `${environment.API_URL}notification/api/v1/${route}`;
    }
    const ms = route.split('/')[0];
    return `${environment.API_URL}${ms}/api/v1/${paths.join('/')}`;
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  getNotificacionesByTransferentIndiciadoCity(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.post<INotificationTransferentIndiciadoCity[]>(
      `${fullRoute}`,
      formData
    );
  }
}
