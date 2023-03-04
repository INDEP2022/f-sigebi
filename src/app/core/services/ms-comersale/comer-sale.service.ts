import { Injectable } from '@angular/core';
import { ComerSalesEndpoints } from 'src/app/common/constants/endpoints/ms-comer-sale';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ComerSaleService extends HttpService {
  constructor() {
    super();
    this.microservice = ComerSalesEndpoints.BasePath;
  }

  getGoodSales(body: any, params?: _Params) {
    return this.post(ComerSalesEndpoints.GoodSales, body, params);
  }
}
