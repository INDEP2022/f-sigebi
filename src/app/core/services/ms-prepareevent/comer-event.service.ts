import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerEvent } from '../../models/ms-event/event.model';

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
}
