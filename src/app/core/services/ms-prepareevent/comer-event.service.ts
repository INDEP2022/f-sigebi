import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IComerEvent,
  IFindAllComerGoodXlotTotal,
} from '../../models/ms-event/event.model';

@Injectable({
  providedIn: 'root',
})
export class ComerEventService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IComerEvent>>('comer-event', params);
  }

  getEatEvents(params: _Params) {
    return this.get<IListResponse<IComerEvent>>(
      'comer-event/getEatEvents',
      params
    );
  }

  createEvent(event: Object) {
    return this.post<IComerEvent>('comer-event', event);
  }

  removeEvent(eventId: string | number) {
    return this.delete(PrepareEventEndpoints.ComerEvent + '/' + eventId);
  }

  getAllFilterComerGood(params: any) {
    return this.get<IListResponse<any>>(`comer-good-xlot`, params);
  }

  getLotId(lotId: string) {
    return this.get(PrepareEventEndpoints.ComerLot + '/' + lotId);
  }

  geEventId(eventId: string) {
    return this.get<IComerEvent>(
      PrepareEventEndpoints.ComerEvent + '/' + eventId
    );
  }
  getAllFilterComerGoodEvent(id: number, params: ListParams) {
    return this.get<IListResponse<any>>(
      `comer-good-xlot?filter.goodNumber=${id}`,
      params
    );
  }
  getAllFilterComerGoodLot(params: any) {
    return this.get<any>(`comer-good-xlot?filter.goodNumber=${params}`);
  }

  getDataEvent(params: _Params | string) {
    return this.get(PrepareEventEndpoints.ApplicationDataEvent, params);
  }

  getAllEvent(params: _Params | string) {
    return this.get(PrepareEventEndpoints.ComerEvent, params);
  }

  getDataTpEvents(idEvent: number) {
    return this.get(`${PrepareEventEndpoints.ApplicationTpEvent}/${idEvent}`);
  }

  updateComerEvent(id: any, params: any) {
    return this.put<IListResponse<IComerEvent>>(`comer-event/${id}`, params);
  }
  getAllFilterLetter(id: number, params: ListParams) {
    return this.get<IListResponse<any>>(
      `comer-good-xlot?filter.lotId=${id}`,
      params
    );
  }
  getFindAllComerGoodXlotTotal(params: _Params) {
    return this.get<IListResponse<IFindAllComerGoodXlotTotal>>(
      PrepareEventEndpoints.FindAllComerGoodXlotTotal,
      params
    );
  }
}
