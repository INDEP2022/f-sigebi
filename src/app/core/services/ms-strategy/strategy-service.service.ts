import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMeasurementUnits } from '../../models/catalogs/measurement-units.model';
import { IStrategyService } from '../../models/ms-strategy-service/strategy-service.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyServiceService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyService>> {
    return this.get<IListResponse<IStrategyService>>(
      StrategyEndpoints.StrategyService,
      params
    );
  }

  create(model: IStrategyService) {
    return this.post(StrategyEndpoints.StrategyService, model);
  }

  update(model: IStrategyService, id: number | string) {
    const route = `${StrategyEndpoints.StrategyService}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyService}/${id}`;
    return this.delete(route);
  }

  getMedUnits(params?: ListParams | string) {
    const route = 'med-units';
    return this.get<IListResponse<IMeasurementUnits>>(route, params);
  }

  getZCenterOperationRegional(
    model: Object,
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      StrategyEndpoints.ZCenterOperationRegional,
      model,
      params
    );
  }

  getZCenterOperationRegional1(model: Object, params?: ListParams) {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post(
      `${this.url}${this.microservice}/${this.prefix}z-center-operation-regional/getAllDescriptionCenterZOperationRegional`,
      model,
      { params, headers }
    );
  }
}
