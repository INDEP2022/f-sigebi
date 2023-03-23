import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IComerTpEvent,
  IComerTpEventSend,
} from '../../models/ms-event/event-type.model';

@Injectable({
  providedIn: 'root',
})
export class ComerTpEventosService extends HttpService {
  private readonly endpoint: string = EventEndpoints.ComerTEvents;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerTpEvent>> {
    return this.get<IListResponse<IComerTpEvent>>(this.endpoint, params);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IComerTpEvent>> {
    return this.get<IListResponse<IComerTpEvent>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(tpenalty: IComerTpEvent) {
    return this.post(this.endpoint, tpenalty);
  }

  update(id: string | number, tpenalty: IComerTpEvent) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  newUpdate(id: string | number, tpenalty: IComerTpEventSend) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }

  getNewId(tpEvents: IComerTpEvent[]): number {
    if (tpEvents.length === 0) return 1;
    let ids: number[];
    ids = tpEvents.map(te => Number(te.id));
    return Math.max(...ids) + 1;
  }

  getEventsByType(id: string | number, params?: ListParams) {
    const route = `${EventEndpoints.ComerTEvents}?filter.address=${id}`;
    return this.get(route, params);
  }
}
