import { Injectable } from '@angular/core';
import { LotEndpoints } from 'src/app/common/constants/endpoints/ms-lot-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class LotService extends HttpService {
  constructor() {
    super();
    this.microservice = LotEndpoints.BasePath;
  }

  getLotbyEvent(id: string | number, params?: ListParams) {
    const route = `${LotEndpoints.ComerLot}?filter.eventId=${id}`;
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
}
