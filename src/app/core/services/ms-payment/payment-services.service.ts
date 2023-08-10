import { Injectable } from '@angular/core';
import { PaymentEndPoints } from 'src/app/common/constants/endpoints/ms-payment';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IComerPaymentsRefVir } from './payment-service';

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

  getComerPaymentRefGetAllV2(params: _Params) {
    return this.get(PaymentEndPoints.GetAllV2, params);
  }

  getPaymentById(filter: number) {
    const route = `comer-payment-ref?filter.lotId=$eq:${filter}`;
    return this.get(route);
  }

  getPaymentPagoRed(params?: string) {
    return this.get('application/get-payment-pagoref', params);
  }

  getComerPaymentRefgetAllV2Total(params: _Params) {
    return this.get(PaymentEndPoints.getAllV2Total, params);
  }

  getFcomerC1(amount: any, params: _Params) {
    return this.get(`${PaymentEndPoints.getFcomerC1}?amount=${amount}`, params);
  }

  getFcomerC2(reference: any, params: _Params) {
    return this.get(
      `${PaymentEndPoints.getFcomerC2}?reference=${reference}`,
      params
    );
  }

  getFcomerC3(params: any) {
    return this.get(`${PaymentEndPoints.getFcomerC3}?reference=${params}`);
  }

  getFcomerC4(params: _Params) {
    return this.get(
      `${PaymentEndPoints.getFcomerC4}?reference=${params}`,
      params
    );
  }

  getComerPagoRefVirt(params?: string) {
    return this.get('comer-payments-ref-virt', params);
  }

  postComerPagoRefVirt(body: IComerPaymentsRefVir) {
    return this.post('comer-payments-ref-virt', body);
  }

  PUP_PROC_NUEVO(evento: string) {
    return this.get(`application/fcomer111-pup-proc-new/${evento}`);
  }
}
