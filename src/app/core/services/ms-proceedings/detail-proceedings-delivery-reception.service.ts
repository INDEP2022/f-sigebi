import { Injectable } from '@angular/core';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class DetailProceeDelRecService extends HttpService {
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getGoodsByProceedings(id: string | number, params?: ListParams) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}?filter.numberProceedings=${id}`;
    return this.get(route, params);
  }
}
