import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerUsuaTxEvent } from '../../models/ms-event/comer-usuatxevent-model';

@Injectable({
  providedIn: 'root',
})

export class ComerUsuauTxEventService extends HttpService {
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  create(model: IComerUsuaTxEvent) {
    return this.post(EventEndpoints.ComerUsuaTxEvent, model);
  }

  update(model: IComerUsuaTxEvent) {
    const route = EventEndpoints.ComerUsuaTxEvent;
    return this.put(route, model);
  }

  getByIdFilter(id: string | number) {
    const route = `${EventEndpoints.ComerUsuaTxEvent}?filter.idEvent=${id}`;
    return this.get(route);
  }

 
}
