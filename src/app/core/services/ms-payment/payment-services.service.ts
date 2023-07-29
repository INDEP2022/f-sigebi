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

  getComerReldisDisp() {
    return this.get(`comer-reldis-disp`);
  }
  createHeader(params: any) {
    return this.post(PaymentEndPoints.CreateHeaderFcomer113, params);
  }

  create(params: any) {
    return this.post(PaymentEndPoints.ComerPaymentRef, params);
  }

  update(id: any, params: any) {
    return this.put(`${PaymentEndPoints.ComerPaymentRef}/${id}`, params);
  }

  sendReadSirsaeFcomer113(params: any) {
    return this.post(PaymentEndPoints.SendReadSirsaeFcomer113, params);
  }

  sendSirsaeFcomer112(params: any) {
    return this.post(PaymentEndPoints.SendSirsaeFcomer112, params);
  }

  getLoadPayment(id: number, params: any) {
    return this.get(`load-payments/${id}`, params);
  }
}
