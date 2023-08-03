import { Injectable } from '@angular/core';
import { PrepareEventEndpoints } from 'src/app/common/constants/endpoints/ms-prepareevent-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerGoodRejected } from '../../models/ms-prepareevent/comer-good-rejected.mode';

@Injectable({
  providedIn: 'root',
})
export class ComerGoodsRejectedService extends HttpService {
  constructor() {
    super();
    this.microservice = PrepareEventEndpoints.PreparaEvent;
  }

  getAllFilter(params: _Params) {
    return this.get<IListResponse<IComerGoodRejected>>(
      'comer-good-rejected',
      params
    );
  }

  getComerGoodXLote(params: _Params) {
    return this.get(PrepareEventEndpoints.ComerGoodXLote, params);
  }

  getFindAllComerGoodXlotTotal(params: _Params) {
    return this.get(PrepareEventEndpoints.getFindAllComerGoodXlotTotal, params);
  }
}
