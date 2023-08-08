import { Injectable } from '@angular/core';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

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

  getLotbyEvent(id: string | number, params?: ListParams) {
    const route = `${LotEndpoints.ComerLot}?filter.idEvent=${id}`;
    return this.get(route, params);
  }

  pubFmtoPackage(value: any) {
    const route = `${LotEndpoints.pubFmtoPackage}`;
    return this.post(route, value);
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

  getSumLotComerPayRef(body: { dateComer: string }, params?: string) {
    return this.post('apps/get-lot-comer-pay-ref-count', body, params);
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
    formData.append('pLot', lot ? `${lot}` : null);
    formData.append('pEvent', eventId ? `${eventId}` : null);
    formData.append('lot', lot ? `${lot}` : null);
    formData.append('pDirection', pDirection);
    return this.post('apps/load-data-billing', formData);
  }
}
