import { Injectable } from '@angular/core';
import { AnyFn } from '@ngrx/store/src/selector';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  INotificationTransferentIndiciadoCityGetData,
  ItVolanteNotificacionesByNoExpedient,
} from '../../models/ms-notification/notification.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class NotificationService
  extends HttpService
  implements ICrudMethods<AnyFn>
{
  getByFileNumber(fileNumber: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private notificationRepository: Repository<any>) {
    super();
    this.microservice = NotificationEndpoints.BasePath;
  }
  /**
   * @deprecated Cambiar a la nueva forma
   */
  getAll(params?: ListParams): Observable<IListResponse<any>> {
    return this.notificationRepository.getAllPaginated(
      'notification/notification',
      params
    );
  }
  /**
   * @deprecated Cambiar a la nueva forma
   */
  getNotificationsFilter(params: string) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}notification/api/v1/notification?${params}`
    );
  }
  /**
   * @deprecated Cambiar a la nueva forma
   */
  getMaxFlyer(expedientId: number | string) {
    return this.notificationRepository.getById(
      'notification/notification/max-flyer-number',
      expedientId + '/option/max'
    );
  }

  /**
   * @deprecated Cambiar a la nueva forma
   */
  update(id: number | string, body: any) {
    return this.httpClient.put(
      `${environment.API_URL}notification/api/v1/notification/${id}`,
      body
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
  create(data: any) {
    return this.post('notification', data);
  }
}
