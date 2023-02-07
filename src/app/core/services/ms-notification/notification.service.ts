import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NotificationRepository } from 'src/app/common/repository/repositories/ms-notification-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INotification } from '../../models/ms-notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly route = NotificationEndpoints;

  constructor(
    private notificationRepository: NotificationRepository<INotification>
  ) {}

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

  create(model: INotification): Observable<INotification> {
    return this.notificationRepository.create(
      this.route.NotifyRatification,
      model
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
