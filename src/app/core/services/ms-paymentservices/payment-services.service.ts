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
}
