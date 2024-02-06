import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
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

  getAllFilter2(params?: ListParams) {
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

  postDetEvento(params: any) {
    return this.post(PrepareEventEndpoints.DetEvent, params);
  }

  postResumenAdmvxr(params: any) {
    return this.post(PrepareEventEndpoints.ResumenAdmvxr, params);
  }

  getNotification(idEvent: number, idLote: number) {
    return this.get<IListResponse<any>>(
      `${PrepareEventEndpoints.ShowNotification}?pEvent=${idEvent}&pBatch=${idLote}`
    );
  }

  getProcessPhaseAnt(idEvent: any) {
    return this.get(
      `${PrepareEventEndpoints.GetProcessPhaseAnt}?event=${idEvent}`
    );
  }
  updatePhase(body: any) {
    return this.patch(`${PrepareEventEndpoints.UpdatePhase}`, body);
  }

  getComerLotes(params: _Params) {
    return this.get<IListResponse<any>>(
      `${PrepareEventEndpoints.ComerLot}`,
      params
    );
  }
  getProcessPhase3Ant(event: any, batch: any) {
    return this.get<IListResponse<any>>(
      `${PrepareEventEndpoints.GetProcessPhase3Ant}?event=${event}&batch=${batch}`
    );
  }
  getValidLiquidation(event: any, batchPublic: any) {
    return this.get<IListResponse<any>>(
      `${PrepareEventEndpoints.GetValidLiquidation}?eventId=${event}&batchPublic=${batchPublic}`
    );
  }
  putUpdateBySubquery(body: any) {
    return this.post(PrepareEventEndpoints.UpdateBySubquery, body);
  }

  getEnvFormalize(body: any) {
    return this.post(PrepareEventEndpoints.EnvFormalize, body);
  }

  validateLiq(eventId: number, batchId: number) {
    return this.get(
      `${PrepareEventEndpoints.ApplicationValidationLiq}?eventId=${eventId}&batchId=${batchId}`
    );
  }

  faMaxdayValid(body: { date: string; day: number }) {
    return this.post(`/api/v1/util-comer-v1/faComerMaxdayValid`, body);
  }

  getCountEventMassiveConversionLc(event: number) {
    return this.get<{ count: number }>('application/count-event/' + event).pipe(
      catchError(x => of({ count: 0 })),
      map(x => x.count)
    );
  }
  getAllFilterLetter_(id: number, params: ListParams) {
    return this.get<IListResponse<any>>(
      `comer-good-xlot?filter.lotId=$eq:${id}`,
      params
    );
  }
}
