import { Injectable } from '@angular/core';
import { ReceptionGoodEndpoint } from 'src/app/common/constants/endpoints/ms-reception-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ReceptionGoodService extends HttpService {
  private readonly receiptGuardRoute = ReceptionGoodEndpoint.ReceptionGuard;
  private readonly receiptGuardGoods = ReceptionGoodEndpoint.ReceptionGuardGood;
  constructor() {
    super();
    this.microservice = ReceptionGoodEndpoint.BasePath;
  }

  getReceptions(params: ListParams) {
    return this.get(this.receiptGuardRoute, params);
  }

  getReceptionGoods(params: ListParams) {
    return this.get(this.receiptGuardGoods, params);
  }

  createReception(formData: Object) {
    return this.post(this.receiptGuardRoute, formData);
  }

  createReceptionGoods(formData: Object) {
    return this.post(this.receiptGuardGoods, formData);
  }
}
