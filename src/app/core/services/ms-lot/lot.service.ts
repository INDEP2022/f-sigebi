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
}
