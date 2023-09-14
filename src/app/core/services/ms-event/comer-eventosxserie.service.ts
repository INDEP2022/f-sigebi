import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { EventXSerie } from '../../models/ms-event/event.model';

@Injectable({
  providedIn: 'root',
})
export class ComerEventosXSerieService extends HttpService {
  private readonly endpoint: string = EventEndpoints.EventXSerie;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAllEvents(
    params?: Params | string
  ): Observable<IListResponse<EventXSerie>> {
    return this.get<IListResponse<EventXSerie>>(
      EventEndpoints.EventXSerie,
      params
    );
  }

  create(comerEvent: EventXSerie) {
    return this.post(this.endpoint, comerEvent);
  }

  update(comerEvent: EventXSerie) {
    return this.put(EventEndpoints.EventXSerie, comerEvent);
  }

  remove(data: { idInvoiceFolio: string; idTpevent: number }) {
    return this.delete(EventEndpoints.EventXSerie, data);
  }
}
