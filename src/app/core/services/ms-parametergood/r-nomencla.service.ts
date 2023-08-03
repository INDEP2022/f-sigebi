import { Injectable } from '@angular/core';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParameters } from '../../models/ms-parametergood/parameters.model';
import { IRNomencla } from '../../models/ms-parametergood/r-nomencla.model';
@Injectable({
  providedIn: 'root',
})
export class RNomenclaService extends HttpService {
  private readonly route = ParameterGoodEndpoints;
  constructor() {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: _Params) {
    return this.get<IListResponse<IRNomencla>>('r-nomencla', params);
  }

  getAllParameters(params?: _Params) {
    return this.get<IListResponse<IParameters>>(this.route.Parameters, params);
  }
}
