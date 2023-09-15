import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIndicatorParameter } from '../../models/ms-parametergood/indicator-parameter.model';
@Injectable({
  providedIn: 'root',
})
export class IndicatorsParametersService extends HttpService {
  private route: string = ParameterGoodEndpoints.RNomencla;
  constructor() {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IIndicatorParameter>> {
    return this.get('indicators-parameter', params);
  }
  getRNomencla(del: number) {
    const route = `${ParameterGoodEndpoints.RNomencla}/${del}`;
    return this.get<IListResponse<any>>(route);
  }
}
