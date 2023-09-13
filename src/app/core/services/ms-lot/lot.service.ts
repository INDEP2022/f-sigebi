import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPupProcDisp, IPupProcEnvSirsae, IPupProcReproc, IPupProcSeldisp, IPupValidateMandatoNfac } from './models-lots';

interface IValidateStatus {
  val: string | number;
}
@Injectable({
  providedIn: 'root',
})
export class LotService extends HttpService {
  private readonly endpointComer: string = 'comer-lotes';
  constructor() {
    super();
    this.microservice = LotEndpoints.BasePath;
  }

  getAllComerLotsFilter(params?: string) {
    return this.get('eat-lots', params);
  }

  getAllComerLotsByFilter(params: HttpParams) {
    return this.get('eat-lots', params);
  }

  getAllComerLot(params?: ListParams) {
    return this.get('eat-lots', params);
  }

  getLotbyEvent(id: string | number, params?: ListParams) {
    const route = `${LotEndpoints.ComerLot}?filter.idEvent=${id}`;
    return this.get(route, params);
  }

  pubFmtoPackage(value: any) {
    const route = `${LotEndpoints.pubFmtoPackage}`;
    return this.post(route, value);
  }

  getConsultPayLots(params?: ListParams) {
    const route = `${LotEndpoints.AppsConsultPayLots}`;
    return this.get(route, params);
  }

  pubCancelPackage(value: any) {
    const route = `${LotEndpoints.pubCancelPackage}`;
    return this.post(route, value);
  }

  getEventId(data: Object) {
    return this.post(LotEndpoints.Event, data);
  }

  getGlobalGood(id: number) {
    return this.get(`${LotEndpoints.EventGlobalGood}/${id}`);
  }

  fillEventStadistics(event: string | number) {
    return this.get('apps/fill-data-statistics/event/' + event);
  }

  eventValDesc(eventId: string | number) {
    return this.get('apps/comer-bases-valdesc-when-button-pressed/' + eventId);
  }

  lotApp(id: any, params: ListParams): Observable<IListResponse<any>> {
    return this.get('apps/query-winners-report/' + id, params);
  }
  querysp(id: any, params: ListParams): Observable<IListResponse<any>> {
    return this.get('apps/query-sp-consult-unpaid-lots/' + id, params);
  }

  updateMandate(body: {
    pGood: number | string;
    pLot: number | string;
    lotId: number | string;
  }) {
    return this.post('apps/act-mandate', body);
  }

  getGoodsExcel(eventId: string | number) {
    return this.get<{
      nameFile: string;
      base64File: string;
    }>(`apps/pup-exp-excel-good-lot/${eventId}`);
  }

  getCustomersExcel(eventId: string | number) {
    return this.get<{
      nameFile: string;
      base64File: string;
    }>(`apps/pup-exp-excel-clients/${eventId}`);
  }

  validLotifying(eventId: string | number) {
    return this.get<{ aux: number }>(
      `apps/blk-ctr-bie-lots-img-inc-lots-excel-when-image-pressed/${eventId}`
    );
  }

  fillTmpComer(body: { pEvent: string | number; pdirec: string }) {
    return this.post('apps/query-fill-tmp-eat', body);
  }

  updateTmpComer(body: { pEvent: string | number; pdirec: string }) {
    return this.post('apps/query-get-act-tmp-eat', body);
  }

  getByLotEventPhoto(good: number, params: ListParams) {
    const route = `${LotEndpoints.GoodByLotsEvent}?filter.good=${good}`;
    return this.get(route, params);
  }
  getGlobalGoodEventLot(idLot: number) {
    return this.get(`${LotEndpoints.ComerLot}?filter.idLot=${idLot}`);
  }

  getLotbyEvent_(params?: _Params) {
    return this.get(LotEndpoints.ComerLot, params);
  }

  checkTransXLot(body: { eventId: string | number; pLote?: string | number }) {
    return this.post<string | { data: string }>(
      'apps/review-transf-x-lot',
      body
    );
  }

  incVXRGoods(body: { goods: (string | number)[]; user: string }) {
    return this.post('apps/rejected-good', body);
  }

  getComerLotsClientsPayref(params?: string) {
    return this.get('apps/get-comer-lots-clients-payref', params);
  }

  getLotById(id: string | number) {
    const route = `eat-lots/${id}`;
    return this.get(route);
  }

  thirdBaseFile(eventId: string | number) {
    return this.get<{
      nameFile: string;
      base64File: string;
    }>(`apps/file-third-base/${eventId}`);
  }

  loadInvoice(eventId: string | number, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.post(`apps/c-invoice/${eventId}`, formData);
  }

  createBases(body: {
    eventId: string | number;
    costBase: string | number;
    file: File;
  }) {
    const { eventId, costBase, file } = body;
    const formData = new FormData();
    formData.append('eventId', eventId ? `${eventId}` : null);
    formData.append('costBase', costBase ? `${costBase}` : null);
    formData.append('file', file);
    return this.post('apps/create-bases', formData);
  }

  getPagosRefMonto(body: any) {
    return this.post('apps/get-pagos-ref-monto', body);
  }

  getPagosRefMontoTipod(body: any) {
    return this.post('apps/get-pagos-ref-monto-tipo-d', body);
  }

  getLotComerPayRef(params?: string) {
    return this.get('apps/get-lot-comer-pay-ref', params);
  }

  getFindAllRegistersTot(params?: _Params) {
    return this.get(LotEndpoints.FindAllRegistersTot, params);
  }

  getSumLotComerPayRef(body: {
    dateComer: string;
    clientId: string;
    eventId: string;
  }) {
    return this.post('apps/get-lot-comer-pay-ref-count', body);
  }

  getSumAllComerPayRef(body: { clientId: string; eventId: string }) {
    return this.post('apps/get-lot-comer-pay-ref-countAll', body);
  }

  applyBaseCost(body: {
    cotobase: string | number;
    lotId: string | number;
    eventId: string | number;
  }) {
    return this.post('apps/blk-ctr-main-l-pb-apply-when-button-pressed', body);
  }

  validateStatusCPV(eventId: string | number) {
    return this.post<IListResponse<{ val: string | number }>>(
      'apps/form-query1',
      { eventId }
    );
  }

  afterRemoveGoods(body: {
    goodId: string | number;
    lotId: string | number;
    eventId: string | number;
  }) {
    return this.post<IListResponse<{ val: string | number }>>(
      'apps/form-query2',
      body
    );
  }

  loadInvoiceData(body: {
    eventId: string | number;
    lot: string | number;
    file: File;
    pDirection: 'M' | 'I';
  }) {
    const { file, lot, eventId, pDirection } = body;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('eventId', eventId ? `${eventId}` : null);
    if (lot) {
      formData.append('pLot', lot ? `${lot}` : null);
      formData.append('lot', lot ? `${lot}` : null);
    }

    formData.append('pEvent', eventId ? `${eventId}` : null);

    formData.append('pDirection', pDirection);
    return this.post('apps/load-data-billing', formData);
  }

  validBaseColumns(body: {
    file: File;
    function: 'CLIENTES' | 'LOTES';
    address: 'M' | 'I';
  }) {
    const formData = new FormData();
    formData.append('file', body.file, body.file.name);
    formData.append('function', body.function);
    formData.append('address', body.address);
    return this.post<IListResponse<{ ERROR?: string }>>(
      'apps/valid-column-base',
      formData
    );
  }

  validateCSV(body: { file: File; tpeventId: string | number }) {
    const { file, tpeventId } = body;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('tpeventId', `${tpeventId}`);
    const url = this.buildRoute('apps/pup-valcsv');
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<{ message: string[]; data: string[] }>(
      url,
      formData,
      {
        headers,
      }
    );
  }

  validateCustomersCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = this.buildRoute('apps/pup-valcsv-clients');
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<{ message: string[]; data: string[] }>(
      url,
      formData,
      {
        headers,
      }
    );
  }

  importCustomersBase(body: {
    file: File;
    eventId: string | number;
    lot: string | number;
    base: string | number;
  }) {
    const { file, eventId, lot, base } = body;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('eventId', eventId ? `${eventId}` : null);
    formData.append('lot', lot ? `${eventId}` : null);
    formData.append('base', base ? `${eventId}` : null);
    return this.post('apps/pup-imp-excel-bases-client', formData);
  }

  lotifyThirdTable(body: {
    event: string | number;
    typeEvent: string | number;
    address: 'M' | 'I';
    user: string;
    bank: string;
  }) {
    return this.post('apps/lotifica-tabla-tc', body);
  }

  lotifyExcelCount(eventId: string | number) {
    const url = `apps/lotifica-excel-count/event/${eventId}`;
    return this.get<{ totlot: string; catlot: string; aprolot: string }>(url);
  }

  impLotExcel(body: {
    file: File;
    event: string;
    eventType: string;
    validGood: string;
    clean: string;
    statusVta: string;
    address: string;
    user: string;
  }) {
    const formData = new FormData();
    formData.append('file', body.file);
    formData.append('event', body.event);
    formData.append('eventType', body.eventType);
    formData.append('validGood', body.validGood);
    formData.append('clean', body.clean);
    formData.append('statusVta', body.statusVta);
    formData.append('address', body.address);
    formData.append('user', body.user);
    return this.post('apps/pup-imp-excel-lote', formData);
  }

  // ------------------------
  PUP_ENTRA(body: any) {
    // PUP_ENTRA
    return this.post(LotEndpoints.PupEntra, body);
  }

  CARGA_PAGOSREFGENS(evento: any) {
    return this.get(`${LotEndpoints.CargaPagosRefGens}/${evento}`);
  }

  CARGA_COMER_DETALLES(evento: any) {
    return this.get(`${LotEndpoints.CargaComerDetalles}/${evento}`);
  }

  VALIDA_MANDATO(evento: any) {
    return this.get(`${LotEndpoints.ValidaMandato}/${evento}`);
  }

  VALIDA_ESTATUS(evento: any) {
    return this.get(`${LotEndpoints.ValidateStatus}/${evento}`);
  }
  VALIDA_LISTANEGRA(evento: any) {
    return this.get(`${LotEndpoints.ValidaListaNegra}/${evento}`);
  }

  getReferenceList(reference: any, params: _Params) {
    return this.get(
      `${LotEndpoints.GetBankReference}?reference=${reference}`,
      params
    );
  }

  //pup-proc-seldisp
  pupProcSeldisp(body: IPupProcSeldisp) {
    return this.post<any>('apps/pup-proc-seldisp', body);
  }

  //get-lot-comer-ref-guarentee
  getLotComerRefGuarentee(params?: string) {
    return this.get('apps/get-lot-comer-ref-guarantee', params);
  }

  pupValidaMandatoNfac(body: IPupValidateMandatoNfac) {
    return this.post('apps/pup-valida-mandato-to-nfac', body);
  }

  postCambioMasivo(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.post(LotEndpoints.PupCambioMasv, formData);
  }

  pupProcDisp(body: IPupProcDisp) {
    return this.post('apps/pup-proc-disp', body);
  }

  comerLotsClientsPayrefSum(idEvent: string | number){
    return this.get(`apps/get-comer-lots-clients-payref-sum/${idEvent}`)
  }

  pupProcEnvSirsae(body: IPupProcEnvSirsae){
    return this.post(`apps/pup-proc-env-sirsae`, body)
  }

  pupProcReproc(body: IPupProcReproc){
    return this.post('apps/pup-proc-reproc',body)
  }
}
