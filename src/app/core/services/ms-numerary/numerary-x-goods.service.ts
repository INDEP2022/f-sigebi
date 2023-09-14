import { Injectable } from '@angular/core';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { INumeraryxGoods } from '../../models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class NumeraryXGoodsService extends HttpService {
  private readonly route = NumeraryEndpoints.ComerNumeraryGoods;
  constructor() {
    super();
    this.microservice = NumeraryEndpoints.Numerary;
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<INumeraryxGoods>>(this.route, params);
  }
}
