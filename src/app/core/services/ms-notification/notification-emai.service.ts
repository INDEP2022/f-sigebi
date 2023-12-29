import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INotificationEmail } from '../../models/ms-notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationEmailService extends HttpService {
  constructor() {
    super();
    this.microservice = NotificationEndpoints.BaseMail;
  }

  getNotificationEmail(
    id?: any,
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/get-EventData',
      id,
      params
    );
  }
  getAllNotificationEmail(
    params?: ListParams | string
  ): Observable<IListResponse<INotificationEmail>> {
    const route = NotificationEndpoints.mail;
    return this.get<IListResponse<INotificationEmail>>(route, params);
  }

  createNotificationEmail(body: Object) {
    const route = NotificationEndpoints.mail;
    return this.post(route, body);
  }

  updateNotificationEmail(body: INotificationEmail) {
    const route = `${NotificationEndpoints.mail}/${body.id}`;
    return this.put(route, body);
  }

  removeNotificationEmail(id: number | string) {
    const route = `${NotificationEndpoints.mail}/${id}`;
    return this.delete(route);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
