import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerEvent, IGraceDate } from './../../models/ms-event/event.model';

@Injectable({
  providedIn: 'root',
})
export class ComerEventosService extends HttpService {
  private readonly endpoint: string = EventEndpoints.ComerEvents;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAllEvents(params?: ListParams): Observable<IListResponse<IComerEvent>> {
    return this.get<IListResponse<IComerEvent>>(EventEndpoints.ComerE, params);
  }

  getAll(params?: _Params): Observable<IListResponse<IComerEvent>> {
    return this.get<IListResponse<IComerEvent>>(this.endpoint, params);
  }
  getAllTypeEvent(params?: ListParams): Observable<IListResponse<IComerEvent>> {
    return this.get<IListResponse<IComerEvent>>(
      EventEndpoints.ComerTEvents,
      params
    );
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get<IComerEvent>(route);
  }

  getById2(id: string | number, params?: ListParams) {
    const route = `${this.endpoint}?filter.id=${id}`;
    return this.get(route, params);
  }

  create(comerEvent: IComerEvent) {
    return this.post(this.endpoint, comerEvent);
  }

  update(id: string | number, comerEvent: IComerEvent) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, comerEvent);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }

  getEventsByType(id: string | number, params?: ListParams) {
    const route = `${EventEndpoints.ComerEvents}?filter.address=${id}`;
    return this.get(route, params);
  }

  getComerEventById(id: string | number, params?: ListParams) {
    return this.get(`${EventEndpoints.ComerE}/${id}`, params);
  }

  validUser(body: { event: number | string; user: string; address: string }) {
    return this.post(EventEndpoints.ComerE + '/valid-user', body);
  }

  getAppGetfComer(body: any, params?: _Params) {
    return this.post(EventEndpoints.AppGetfComer, body, params);
  }

  getSelectComerEvent(params: _Params, goodType: any) {
    return this.get(`application/selectComerEvent/${goodType}`, params);
  }

  getPaymentLots(id: any) {
    return this.get(`application/get-lots-payments/${id}`);
  }

  pupExpExcel(body: any) {
    // PUP_EXP_EXCEL
    return this.post('application/pup-exp-excel', body);
  }

  pupExpxcVenvspag(body: any) {
    //PUP_EXPEXC_VENVSPAG
    return this.post('application/pup-expxc-venvspag', body);
  }

  pupExpPayModest(body: any) {
    // PUP_EXPPAGOMODEST
    return this.post('application/pup-exp-pay-modest', body);
  }

  pupExportDetpayments(body: any) {
    // PUP_EXPORT_DETPAGOS
    return this.post('application/pup-export-detpayments', body);
  }

  getByIdComerTEvents(id: string | number) {
    return this.get<IListResponse<any>>(`${EventEndpoints.ComerTEvents}/${id}`);
  }

  getMANDXEVENTO(event: string) {
    return this.get(EventEndpoints.MANDXEVENTO + '/' + event);
  }

  getComerEventGet(params: ListParams) {
    return this.get(EventEndpoints.ComerEventGetEvent, params);
  }

  //PUF GRACE DATE
  pufGraceDate(body: IGraceDate) {
    return this.post('application/puf-grace-date', body);
  }

  //------------- INMUEBLES -------------START//
  pupExpExcelI(evento: any) {
    // PUP_EXP_EXCEL
    return this.get(`application/pup-exp-excel/${evento}`);
  }

  pupExpPayModestI(evento: any) {
    // PUP_EXPPAGOMODEST
    return this.get(`application/pup-exp-payment-modest/${evento}`);
  }

  pupExportDetpaymentsI(body: any) {
    // PUP_EXPORT_DETPAGOS
    return this.post('application/pup-export-det-payments', body);
  }
  //------------- INMUEBLES -------------END//

  GetEventXLot(body: any, params?: _Params) {
    return this.post(EventEndpoints.GetEventXLot, body, params);
  }

  /* SUMATORIA DE TOTALES */
  getAmountsMtodisp(body: {clientId: number, eventId: number}){
    return this.post('application/get-amounts', body)
  }
}
