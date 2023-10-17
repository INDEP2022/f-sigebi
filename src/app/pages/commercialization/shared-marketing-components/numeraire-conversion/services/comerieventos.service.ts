import { Injectable } from '@angular/core';
import { EventEndpoints } from 'src/app/common/constants/endpoints/ms-event-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerieventosService extends HttpService {
  private readonly endpoint: string = EventEndpoints.ComerEvents;
  constructor() {
    super();
    this.microservice = EventEndpoints.BasePath;
  }

  getAllFilterSelf(self?: ComerieventosService, params?: _Params) {
    return self.get<IListResponseMessage<any>>(
      EventEndpoints.ComerE +
        '?filter.eventTpId=$in:0,1,2,3,4,5&filter.address=$eq:I&sortBy=id:ASC',
      params
    );
  }

  getAllFilterSelf2(self?: ComerieventosService, params?: _Params) {
    return self.get<IListResponseMessage<any>>(
      EventEndpoints.ComerE +
        '?filter.eventTpId=$in:3&filter.address=$eq:I&sortBy=id:ASC',
      params
    );
  }
}
