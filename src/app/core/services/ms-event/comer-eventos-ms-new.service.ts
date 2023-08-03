import { Injectable } from '@angular/core';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ComerEventosServiceTwo extends HttpService {
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePathTwo;
  }

  getByIdTwo(id: number) {
    const route = `${EventEndpoints.ComerE}/${id}`;
    return this.get(route);
  }
}
