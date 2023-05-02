import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NotificationRepository } from 'src/app/common/repository/repositories/ms-notification-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  INotification,
  INotificationInquiry,
  INotificationTransferentIndiciadoCityGetData,
  ItVolanteNotificacionesByNoExpedient,
} from '../../models/ms-notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends HttpService {
  private readonly route = NotificationEndpoints;

  constructor(
    private notificationRepository: NotificationRepository<INotification>
  ) {
    super();
    this.microservice = this.route.Notification;
  }

  getAll(params?: ListParams): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(this.route.Notification, params);
  }

  getAllFilter(params: _Params): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      `${this.route.Notification}?${params}`
    );
  }

  getAllFilterTmpNotification(
    params: _Params
  ): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      `${this.route.TmpNotification}?${params}`
    );
  }

  create(body: INotification): Observable<INotification> {
    return this.post(this.route.Notification, body);
  }

  update(
    wheelNumber: number,
    notification: Partial<INotification>
  ): Observable<{ statusCode: number; message: string[] }> {
    return this.put(`${this.route.Notification}/${wheelNumber}`, notification);
  }

  getLastWheelNumber(): Observable<{ nextval: number }> {
    return this.get<{ max: string }>(this.route.LastFlyerId).pipe(
      map(resp => {
        return { nextval: Number(resp.max) };
      })
    );
  }

  getDailyConsecutive(
    delegation: number,
    subdelegation: number
  ): Observable<{ consecutivedaily: number }> {
    return this.get<{ consecutivedaily: string }>(
      `${this.route.Notification}/${this.route.DailyConsecutive}/delegation/${delegation}/subdelegation/${subdelegation}`
    ).pipe(
      map(resp => {
        return { consecutivedaily: Number(resp.consecutivedaily) };
      })
    );
  }

  findTransferentCity(body: {
    city: number;
    indiciado: number;
    transferent: string;
  }): Observable<IListResponse<INotification>> {
    return this.post(this.route.FindTransferentCity, body);
  }

  findCountByInquiry(
    body: INotificationInquiry
  ): Observable<IListResponse<INotification>> {
    return this.post(this.route.FindCountByInquiry, body);
  }

  getMaxFlyerByExpedient(
    expedient: number,
    type: 'MIN' | 'MAX'
  ): Observable<{ no_volante: number }> {
    return this.get(
      `${this.route.MaxFlyerNumber}/${expedient}/option/${type}`
    ).pipe(
      map((resp: { no_volante: string }) => {
        return { no_volante: Number(resp.no_volante) };
      })
    );
  }

  getByNotificationxProperty(
    params?: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(
      this.route.NotificationxProperty,
      params
    );
  }

  createNotificationxPropertyFilter(model: any): Observable<any> {
    return this.notificationRepository.create(
      this.route.NotificationxPropertyFilter,
      model
    );
  }

  updateNotificationxPropertyFilter(
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: Object
  ): Observable<any> {
    return this.notificationRepository.updateNotification(
      this.route.NotificationxPropertyPut,
      numberProperty,
      notificationDate,
      formData
    );
  }

  updateupdateNotification(
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: INotification
  ): Observable<Object> {
    return this.notificationRepository.updateNotification(
      this.route.NotificationxPropertyPut,
      numberProperty,
      notificationDate,
      formData
    );
  }

  getNotificacionesByTransferentIndiciadoCity(
    body: INotificationTransferentIndiciadoCityGetData | any
  ) {
    return this.notificationRepository.getNotificacionesByTransferentIndiciadoCity(
      'notification/notification/find-notification-by-transferent-or-city',
      body
    );
  }

  getVolanteNotificacionesByNoExpedient(id: string) {
    let expedient = encodeURI(id);
    return this.httpClient.get<
      IListResponse<ItVolanteNotificacionesByNoExpedient>
    >('notification/notification/find-count-by-expedient/' + expedient);
  }
}
