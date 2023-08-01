import { Injectable } from '@angular/core';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class EventAppService extends HttpService {
  private readonly endpoint: string = EventEndpoints.Application;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  verifyRejectedGoods(eventId: string | number) {
    return this.get<{ data: number }>(
      `${this.endpoint}/verifyrejected/${eventId}`
    );
  }
}
