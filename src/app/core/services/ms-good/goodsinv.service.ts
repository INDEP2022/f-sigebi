import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGoodsinvEndpoint } from 'src/app/common/constants/endpoints/ms-goodsinv.endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IClient } from 'src/app/pages/request/scheduling-deliveries/scheduling-deliveries-form/type-events';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import {
  IDescInv,
  IGoodInvAvailableView,
  IGoodInvDestructionView,
  IGoodResDevInvView,
  IGoodsInv,
} from '../../models/ms-goodsinv/goodsinv.model';
import { ISamplingGoodView } from '../../models/ms-goodsinv/sampling-good-view.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsInvService extends HttpService {
  constructor() {
    super();
    this.microservice = IGoodsinvEndpoint.GoodsInv;
  }

  getCatUnitMeasureView(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodsInv>> {
    return this.get<IListResponse<IGoodsInv>>(
      IGoodsinvEndpoint.CatUnitsMeasureView,
      params
    );
  }

  getDescription(gestion: string) {
    return this.get<IListResponseMessage<IDescInv>>(
      IGoodsinvEndpoint.GetDescription + '/' + gestion
    );
  }

  getMunicipalitiesByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetMunicipalityByParams, params);
  }

  getTownshipByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetTownshipByParams, params);
  }

  getCodePostalByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetCodePostalByParams, params);
  }

  getAllMunipalitiesByFilter(_params: ListParams | string) {
    const params = this.makeParams(_params);
    return this.get(IGoodsinvEndpoint.GetMunicipalityByFilter, params);
  }

  getAllTownshipByFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.getTownshipByFilter, params);
  }

  getAllCodePostalByFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCodePostalByFilter, params);
  }

  getAllBrandWithFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCatBrandWithFilter, params);
  }

  getAllSubBrandWithFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCatSubBrandWithFilter, params);
  }

  getAllGoodResDevInvView(
    params: ListParams | string
  ): Observable<IGoodResDevInvView> {
    const route = IGoodsinvEndpoint.GetGoodResDevInvVew;
    return this.get(`${route}`, params);
  }

  getAllGoodInv(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IGoodInvAvailableView>> {
    const params = this.makeParams(_params);
    const route = IGoodsinvEndpoint.GetGoodInvView;
    return this.post<IListResponse<IGoodInvAvailableView>>(
      `${route}?${params}`,
      formData
    );
  }

  getClients(
    _params: ListParams,
    formData: Object
  ): Observable<IListResponse<IClient>> {
    const params = this.makeParams(_params);
    const route = IGoodsinvEndpoint.GetClients;
    return this.post<IListResponse<IClient>>(`${route}?${params}`, formData);
  }

  getClientName(formData: Object): Observable<IListResponse<IClient>> {
    const route = IGoodsinvEndpoint.GetClients;
    return this.post<IListResponse<IClient>>(`${route}`, formData);
  }

  getDestructionView(
    _params: ListParams
  ): Observable<IListResponse<IGoodInvDestructionView>> {
    const params = this.makeParams(_params);
    const route = IGoodsinvEndpoint.GetGoodDestView;
    return this.get<IListResponse<IGoodInvDestructionView>>(
      `${route}?${params}`
    );
  }

  getSamplingGoodView(
    params: ListParams | string
  ): Observable<IListResponse<ISamplingGoodView>> {
    const route = IGoodsinvEndpoint.getSamplingGoodView;
    return this.get<IListResponse<ISamplingGoodView>>(`${route}`, params);
  }

  getStoresProgramming(
    _params: ListParams,
    data: Object
  ): Observable<IListResponse<ISamplingGoodView>> {
    const params = this.makeParams(_params);
    const route = IGoodsinvEndpoint.getStoresProgramming;
    return this.post<IListResponse<ISamplingGoodView>>(
      `${route}?${params}`,
      data
    );
  }

  private makeParams(params: ListParams | string): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
