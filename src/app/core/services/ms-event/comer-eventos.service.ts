import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerEvent } from './../../models/ms-event/event.model';

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

  getAll(params?: ListParams): Observable<IListResponse<IComerEvent>> {
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
}
