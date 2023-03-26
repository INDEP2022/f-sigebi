import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ClarificationGoodRejectNotification } from '../../models/ms-clarification/clarification-good-reject-notification';

@Injectable({
  providedIn: 'root',
})
export class RejectedGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = 'rejectedgood';
  }

  create(model: ClarificationGoodRejectNotification): Observable<any> {
    return this.post('clarification-goods-reject-notification', model);
  }

  update(
    id: string | number,
    model: ClarificationGoodRejectNotification
  ): Observable<any> {
    return this.post(`clarification-goods-reject-notification/${id}`, model);
  }

  getAllFilter(
    params?: ListParams | string
  ): Observable<IListResponse<ClarificationGoodRejectNotification>> {
    return this.get('clarification-goods-reject-notification', params);
  }
}
