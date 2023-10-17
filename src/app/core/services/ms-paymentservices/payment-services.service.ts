import { Injectable } from '@angular/core';
import { PaymentServicesEndPoints } from 'src/app/common/constants/endpoints/ms-payment-services';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentServicesService extends HttpService {
  private readonly endpoint: string = PaymentServicesEndPoints.Payment;
  constructor() {
    super();
    this.microservice = PaymentServicesEndPoints.PaymentServices;
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/getSum/${id}`;
    return this.get(route);
  }

  getPayment(params?: _Params) {
    return this.get(PaymentServicesEndPoints.Payment, params);
  }

  deletePayment(id: number) {
    return this.delete(`${PaymentServicesEndPoints.Payment}/${id}`);
  }

  postPayment(body: any) {
    return this.post(PaymentServicesEndPoints.Payment, body);
  }

  getPaymentServiceId(id: number) {
    return this.get(`${PaymentServicesEndPoints.Payment}/${id}`);
  }

  getAll(params?: _Params) {
    return this.get(PaymentServicesEndPoints.GetData, params);
  }

  inserGoodsAux(body: any) {
    return this.post(PaymentServicesEndPoints.InserGoodsAux, body);
  }

  inserGoodsReq(body: any) {
    return this.post(PaymentServicesEndPoints.InserGoodsReq, body);
  }
  pupSpent(body: any) {
    return this.post(PaymentServicesEndPoints.PupSpent, body);
  }
}
