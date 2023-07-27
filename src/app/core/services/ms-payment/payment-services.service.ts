import { Injectable } from '@angular/core';
import { PaymentEndPoints } from 'src/app/common/constants/endpoints/ms-payment';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends HttpService {
  private readonly endpoint: string = PaymentEndPoints.BasePath;
  constructor() {
    super();
    this.microservice = PaymentEndPoints.BasePath;
  }

  getComerPaymentRef(params: _Params) {
    return this.get(PaymentEndPoints.ComerPaymentRef, params);
  }

  remove(id: any) {
    return this.delete(`${PaymentEndPoints.ComerPaymentRef}/${id}`);
  }

  getComerReldisDisp(){
    return this.get(`comer-reldis-disp`)
  }
}
