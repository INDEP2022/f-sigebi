import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RejectedGoodEndpoint } from 'src/app/common/constants/endpoints/ms-rejectedgood-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IGetGoodResVe,
  IPostGoodResDev,
} from '../../models/ms-rejectedgood/get-good-goodresdev';

@Injectable({
  providedIn: 'root',
})
export class GetGoodResVeService extends HttpService {
  constructor() {
    super();
    this.microservice = RejectedGoodEndpoint.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IGetGoodResVe>> {
    return this.get<IListResponse<IGetGoodResVe>>(
      RejectedGoodEndpoint.GetGoodResDev,
      params
    );
  }

  getAllGoodResDev(
    params?: ListParams | string
  ): Observable<IListResponse<IGetGoodResVe>> {
    return this.get<IListResponse<IGetGoodResVe>>(
      RejectedGoodEndpoint.GoodsResDev,
      params
    );
  }

  create(goodResDev: any): Observable<IPostGoodResDev> {
    return this.post<IPostGoodResDev>(
      RejectedGoodEndpoint.GoodsResDev,
      goodResDev
    );
  }

  update(goodResDev: any): Observable<IPostGoodResDev> {
    return this.put<IPostGoodResDev>(
      `${RejectedGoodEndpoint.GoodsResDev}/${goodResDev.goodresdevId}`,
      goodResDev
    );
  }

  remove(id: number) {
    return this.delete<IPostGoodResDev>(
      `${RejectedGoodEndpoint.GoodsResDev}/${id}`
    );
  }
}
