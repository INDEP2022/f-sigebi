import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RejectedGoodEndpoint } from 'src/app/common/constants/endpoints/ms-rejectedgood-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ClarificationGoodRejectNotification } from '../../models/ms-clarification/clarification-good-reject-notification';
import { IGoodsResDev } from '../../models/ms-rejectedgood/goods-res-dev-model';

@Injectable({
  providedIn: 'root',
})
export class RejectedGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = RejectedGoodEndpoint.BasePath;
  }

  create(model: ClarificationGoodRejectNotification): Observable<any> {
    return this.post(RejectedGoodEndpoint.ClarificationGoodsReject, model);
  }

  update(
    id: string | number,
    model: ClarificationGoodRejectNotification
  ): Observable<any> {
    return this.put(
      `${RejectedGoodEndpoint.ClarificationGoodsReject}/${id}`,
      model
    );
  }

  remove(id: string | number): Observable<any> {
    return this.delete(
      `${RejectedGoodEndpoint.ClarificationGoodsReject}/${id}`
    );
  }

  getAllFilter(
    params?: ListParams | string
  ): Observable<IListResponse<ClarificationGoodRejectNotification>> {
    return this.get(RejectedGoodEndpoint.ClarificationGoodsReject, params);
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodsResDev>> {
    return this.get<IListResponse<IGoodsResDev>>(
      RejectedGoodEndpoint.GoodsResDev,
      params
    );
  }
}
