import { Injectable } from '@angular/core';
import { ClientPenaltyEndpoints } from 'src/app/common/constants/endpoints/ms-client-penalty';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientPenaltyService extends HttpService {
  constructor() {
    super();
    this.microservice = ClientPenaltyEndpoints.BasePath;
  }

  getAll(params: _Params) {
    return this.get<IListResponse<any>>(ClientPenaltyEndpoints.PayRef, params);
  }
}
