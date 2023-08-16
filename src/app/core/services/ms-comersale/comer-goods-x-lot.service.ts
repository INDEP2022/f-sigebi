import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComerSalesEndpoints } from 'src/app/common/constants/endpoints/ms-comer-sale';
import { IComerGoodXLot } from 'src/app/common/constants/endpoints/ms-comersale/comer-good-x-lot.model';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerGoodsXLotService extends HttpService {
  constructor() {
    super();
    this.microservice = ComerSalesEndpoints.BasePath;
  }

  getAllFilter(params?: _Params) {
    return this.get('comer-goods-x-lot', params);
  }

  getAllFilterPostQuery(params: _Params) {
    return this.get<IListResponse<IComerGoodXLot>>(
      'comer-goods-x-lot/post-query',
      params
    );
  }

  getpaREportLoser(
    id?: any,
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/paREportLoser',
      id,
      params
    );
  }

  udpate(body: any) {
    return this.put('comer-goods-x-lot', body);
  }
}
