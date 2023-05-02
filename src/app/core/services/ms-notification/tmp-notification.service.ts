import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ITmpNotification } from '../../models/ms-notification/tmp-notification.model';

@Injectable({
  providedIn: 'root',
})
export class TmpNotificationService extends HttpService {
  private readonly route = NotificationEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Notification;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITmpNotification>> {
    return this.get<IListResponse<ITmpNotification>>(
      this.route.TmpNotification,
      params
    );
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<ITmpNotification>> {
    return this.get<IListResponse<ITmpNotification>>(
      this.route.TmpNotification,
      params
    );
  }

  getById(id: string | number): Observable<ITmpNotification> {
    const route = `${this.route.TmpNotification}/${id}`;
    return this.get(route);
  }

  create(body: ITmpNotification) {
    return this.post(this.route.TmpNotification, body);
  }

  update(id: string | number, body: ITmpNotification) {
    const route = `${this.route.TmpNotification}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.TmpNotification}/wheel-number/${id}`;
    return this.delete(route);
  }
}
