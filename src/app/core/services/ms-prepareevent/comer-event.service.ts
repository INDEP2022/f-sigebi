import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerEventService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  getAllFilterComerGood(params: any) {
    return this.get<IListResponse<any>>(`comer-good-xlot`, params);
  }

  getLotId(lotId: string) {
    return this.get(PrepareEventEndpoints.ComerLot + '/' + lotId);
  }

  geEventId(eventId: string) {
    return this.get(PrepareEventEndpoints.ComerEvent + '/' + eventId);
  }
}
