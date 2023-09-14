import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerLot } from '../../models/ms-prepareevent/comer-lot.model';

@Injectable({
  providedIn: 'root',
})
export class ComerClientService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IComerLot>>('comer-client', params);
  }

  getByEvent(_params: ListParams | string) {
    const route = `${PrepareEventEndpoints.ComerEvent}`;
    return this.get(route, _params);
  }

  getcomerGoodxLot(_params: ListParams) {
    const route = `comer-good-xlot`;
    return this.get(route, _params);
  }
}
