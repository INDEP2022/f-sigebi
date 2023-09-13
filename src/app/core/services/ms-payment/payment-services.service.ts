import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentEndPoints } from 'src/app/common/constants/endpoints/ms-payment';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { AuthService } from '../authentication/auth.service';
import {
  IComerPaymentsRefVir,
  IComerReldisDisp,
  IOI,
  IOI_DTO,
} from './payment-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends HttpService {
  private readonly endpoint: string = PaymentEndPoints.BasePath;
  constructor(private http: HttpClient, private authService: AuthService) {
    super();
    this.microservice = PaymentEndPoints.BasePath;
  }

  getOI(body: IOI_DTO) {
    return this.post<IListResponseMessage<IOI>>(PaymentEndPoints.getOI, body);
  }

  getComerPaymentRef(params: _Params) {
    return this.get(PaymentEndPoints.ComerPaymentRef, params);
  }

  remove(id: any) {
    return this.delete(`${PaymentEndPoints.ComerPaymentRef}/${id}`);
  }

  getComerReldisDisp(params?: string) {
    return this.get(`comer-reldis-disp`, params);
  }

  updateComerReldisDisp(id: string, body: IComerReldisDisp) {
    return this.put(`comer-reldis-disp/${id}`, body);
  }

  deleteComerReldisDisp(id: string) {
    return this.delete(`comer-reldis-disp/${id}`);
  }

  postComerReldisDiso(body: IComerReldisDisp) {
    return this.post(`comer-reldis-disp`, body);
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

  updatePayments(body: any) {
    return this.put(PaymentEndPoints.UpdatePayments, body);
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
  getBusquedaPag(params?: any) {
    return this.get(
      `${PaymentEndPoints.BusquedaPagosDet}?filter.tsearchId=$eq:${5}`,
      params
    );
  }
  // postComerPagoRefVirt(body: IComerPaymentsRefVir) {
  //   return this.post('comer-payments-ref-virt', body);
  // }

  getBusquedaMae(params: number | string) {
    return this.get(
      PaymentEndPoints.BusquedaPagosMae,
      `&filter.tsearchId=$eq:${params}`
    );
  }

  getSearchId(id: number | string) {
    return this.get(
      `${PaymentEndPoints.BusquedaPagosDet}?filter.tsearchId=$eq:${id}`
    );
  }

  deleteId(id: number | string) {
    return this.delete(`${PaymentEndPoints.Delete}/${id}`);
  }

  UpdateRecord(params: any) {
    return this.put(PaymentEndPoints.BusquedaPagosDet, params);
  }

  getValidSystem(filter?: string) {
    if (filter != null) {
      return this.get(
        `${PaymentEndPoints.validSystem}?filter.valsisKey=$eq:${filter}`
      );
    } else {
      return this.get(`${PaymentEndPoints.validSystem}`);
    }
  }

  getValidSystemDesc(filter?: string) {
    if (filter != null) {
      return this.get(
        `${PaymentEndPoints.validSystem}?filter.valsisDescription=$eq:${filter}`
      );
    } else {
      return this.get(`${PaymentEndPoints.validSystem}`);
    }
  }

  postCreateRecord(params: any) {
    return this.post(PaymentEndPoints.BusquedaPagosDet, params);
  }

  getCtlDevPagB(params: _Params) {
    return this.get(`${PaymentEndPoints.ComerCtldevpagB}`, params);
  }

  getCtlDevPagBfindAllRegistersV2(params: ListParams) {
    // return this.get(
    //   `${PaymentEndPoints.ComerCtldevpagBfindAllRegistersV2}`,
    //   params
    // );
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    this.authService.setReportFlag(true);
    const route = `${this.url}${this.microservice}/${this.prefix}${PaymentEndPoints.ComerCtldevpagBfindAllRegistersV2}`;
    return this.http.get<any>(`${route}`, {
      headers,
      params,
      // responseType: 'arraybuffer' as 'json',
    });
  }

  getPaymentRefById_(id: any) {
    return this.get(`${PaymentEndPoints.ComerPaymentRef}/${id}`);
  }
}
