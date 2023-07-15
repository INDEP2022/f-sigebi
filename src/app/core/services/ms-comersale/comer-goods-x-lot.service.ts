import { Injectable } from '@angular/core';
import { ComerSalesEndpoints } from 'src/app/common/constants/endpoints/ms-comer-sale';
import { HttpService, _Params } from 'src/app/common/services/http.service';

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
}
