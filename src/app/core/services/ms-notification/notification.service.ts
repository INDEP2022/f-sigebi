import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NotificationRepository } from 'src/app/common/repository/repositories/ms-notification-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INotification } from '../../models/ms-notification/notification.model';

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

  getByNotificationxProperty(
    params?: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(
      this.route.NotificationxProperty,
      params
    );
  }

  // update(id: string | number, notification: Object) {
  //   const fullRoute = `${this.route.Notification}/${id}`;
  //   return this.put(fullRoute, notification);
  // }

  getAllFilter(params: _Params): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      `${this.route.Notification}?${params}`
    );
  }

  create(model: INotification): Observable<INotification> {
    return this.notificationRepository.create(
      this.route.NotifyRatification,
      model
    );
  }

  update(
    wheelNumber: number,
    notification: Partial<INotification>
  ): Observable<{ statusCode: number; message: string[] }> {
    return this.put(`${this.route.Notification}/${wheelNumber}`, notification);
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
}
