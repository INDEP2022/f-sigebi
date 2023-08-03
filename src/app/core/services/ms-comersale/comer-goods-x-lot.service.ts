import { Injectable } from '@angular/core';
import { ComerSalesEndpoints } from 'src/app/common/constants/endpoints/ms-comer-sale';
import { IComerGoodXLot } from 'src/app/common/constants/endpoints/ms-comersale/comer-good-x-lot.model';
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
}
