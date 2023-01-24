import { Injectable } from '@angular/core';
import { AnyFn } from '@ngrx/store/src/selector';
import { Observable } from 'rxjs';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
@Injectable({
  providedIn: 'root',
})
export class NotificationService implements ICrudMethods<AnyFn> {
  constructor(private notificationRepository: Repository<any>) {}

  getAll(params?: ListParams): Observable<IListResponse<any>> {
    return this.notificationRepository.getAllPaginated('', params);
  }

  getMaxFlyer(expedientId: number | string) {
    return this.notificationRepository.getById(
      'notification/notification/max-flyer-number',
      expedientId + '/option/max'
    );
  }
}
