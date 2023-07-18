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
}
