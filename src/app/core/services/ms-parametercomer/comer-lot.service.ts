import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerLotsEG, IEvent } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ComerLotService extends HttpService {
  private readonly endpoint: string = EventEndpoints.ComerLotEvent;
  private readonly fiterByEvent: string = EventEndpoints.FilterEvent;
  private readonly evento: string = EventEndpoints.ComerE;
  private readonly fiterByGood: string = EventEndpoints.FilterGood;
  private readonly fiterByLot: string = EventEndpoints.FilterLot;

  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerLotsEG>> {
    return this.get<IListResponse<IComerLotsEG>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }
  findGood(search: any) {
    const route = `${this.endpoint}${this.fiterByGood}${search}`;
    return this.get(route);
  }
  findGLot(search: any) {
    const route = `${this.endpoint}${this.fiterByLot}${search}`;
    return this.get(route);
  }
  findEvent(search: any) {
    const route = `${this.endpoint}${this.fiterByEvent}${search}`;
    return this.get(route);
  }
  getEventById(id: number) {
    const route = `${this.evento}/${id}`;
    return this.get(route);
  }
  getEventAll(params?: ListParams): Observable<IListResponse<IEvent>> {
    return this.get<IListResponse<IEvent>>(this.evento, params);
  }
}
