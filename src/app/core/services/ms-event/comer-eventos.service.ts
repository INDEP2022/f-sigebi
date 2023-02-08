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

  getAll(params?: ListParams): Observable<IListResponse<IComerEvent>> {
    return this.get<IListResponse<IComerEvent>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(tpenalty: IComerEvent) {
    return this.post(this.endpoint, tpenalty);
  }

  update(id: string | number, tpenalty: IComerEvent) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
