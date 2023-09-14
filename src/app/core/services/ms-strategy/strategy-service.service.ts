import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUnitsMedConv } from '../../models/administrative-processes/siab-sami-interaction/measurement-units';
import { IMeasurementUnits } from '../../models/catalogs/measurement-units.model';
import {
  IStrategyLovSer,
  IStrategyService,
  IStrategyType,
  IStrategyTypeService,
} from '../../models/ms-strategy-service/strategy-service.model';

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

  getStrategiesAdmin(params: any) {
    return this.post(`${StrategyEndpoints.StrategyAdmin}/id?`, params);
  }

  getfolioDeliveredWeather(
    yearEvaluateId: string,
    monthEvaluateId: number,
    delegationNumberId: number
  ) {
    return this.get(
      `folio-delivered-weather?filter.yearEvaluateId=$eq:${yearEvaluateId}&filter.monthEvaluateId=$eq:${monthEvaluateId}&filter.delegationNumberId=$eq:${delegationNumberId}`
    );
  }

  postValidaIndica(model: any) {
    return this.get(`folio-delivered-weather/id`, model);
  }

  //T_FOL_REG
  pupValidaIndica(model: any) {
    return this.post(`folio-delivered-weather/validIndication`, model);
  }

  //T_FOL_ENT
  pupValidaIndicaRep(model: any) {
    return this.post(`folio-delivered-weather/validIndicationRep`, model);
  }

  //T_REP_REG
  pupValidaIndicaTime(model: any) {
    return this.post(`folio-delivered-weather/validIndicationTime`, model);
  }

  //T_REP_ENT
  pupValidaIndicaVal(model: any) {
    return this.post(`folio-delivered-weather/validIndicationVal`, model);
  }

  getAllType(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyTypeService>> {
    return this.get<IListResponse<IStrategyTypeService>>(
      StrategyEndpoints.StrategyServiceType,
      params
    );
  }

  updateType(model: IStrategyTypeService, id: number | string) {
    const route = `${StrategyEndpoints.StrategyServiceType}/${id}`;
    return this.put(route, model);
  }

  createType(model: IStrategyTypeService) {
    return this.post(StrategyEndpoints.StrategyServiceType, model);
  }

  removeType(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyServiceType}/${id}`;
    return this.delete(route);
  }

  getUnitsMedXConv(
    _params?: ListParams | string
  ): Observable<IListResponse<IUnitsMedConv>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<IUnitsMedConv>>(
      `${StrategyEndpoints.UnitsMedConv}?${params}`
    );
  }

  private makeParams(params: ListParams | string): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
  getServiceType(model: IStrategyType) {
    return this.post(StrategyEndpoints.StrategyType, model);
  }
  getServiceLov(ser: IStrategyLovSer) {
    return this.post(StrategyEndpoints.StrategySer, ser);
  }
  getProcess(params: _Params) {
    return this.get(StrategyEndpoints.StrategyPro, params);
  }
}
