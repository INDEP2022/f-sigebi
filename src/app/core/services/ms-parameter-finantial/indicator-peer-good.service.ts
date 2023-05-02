import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterFinantialEndpoints } from 'src/app/common/constants/endpoints/ms-parameter-finantial';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IFinancialIndicatorsW } from '../../models/catalogs/financial-indicators-model';

@Injectable({
  providedIn: 'root',
})
export class IndicatorPeerGoodService extends HttpService {
  private readonly endpoint: string = ParameterFinantialEndpoints.IndicatorGood;
  private readonly find: string = ParameterFinantialEndpoints.FindFinantial;
  constructor() {
    super();
    this.microservice = ParameterFinantialEndpoints.BasePath;
  }
  getAll(
    params?: ListParams
  ): Observable<IListResponse<IFinancialIndicatorsW>> {
    return this.get<IListResponse<IFinancialIndicatorsW>>(
      this.endpoint,
      params
    );
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }
  findGood(search: any) {
    const route = `${this.endpoint}${this.find}${search}`;
    return this.get(route);
  }
  create(indicator: IFinancialIndicatorsW) {
    const route = `${this.endpoint}`;
    return this.post(route, indicator);
  }
}
