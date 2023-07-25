import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
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
}
