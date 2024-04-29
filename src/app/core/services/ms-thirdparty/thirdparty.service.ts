import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IThirdParty } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IThirdParty>> {
    return this.get<IListResponse<IThirdParty>>(
      ThirdPartyEndpoints.ThirdParty,
      params
    );
  }

  update(id: string | number, model: IThirdParty) {
    const route = `${ThirdPartyEndpoints.ThirdParty}/id/${id}`;
    return this.put(route, model);
  }

  create(model: IThirdParty) {
    return this.post(ThirdPartyEndpoints.ThirdParty, model);
  }

  remove(id: string | number) {
    const route = `${ThirdPartyEndpoints.ThirdParty}/id/${id}`;
    return this.delete(route);
  }
  getAllFindItemV2(params?: _Params): Observable<IListResponse<IThirdParty>> {
    return this.get<IListResponse<IThirdParty>>(
      ThirdPartyEndpoints.FindItemV2,
      params
    );
  }

  getFindItemCustom(params?: _Params): Observable<IListResponse<IThirdParty>> {
    return this.get<IListResponse<IThirdParty>>(
      ThirdPartyEndpoints.FindItemCustom,
      params
    );
  }

  // ---
  getLOV_SERVICIOS(
    numberProcess: number | string,
    params?: _Params
  ): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      ThirdPartyEndpoints.LOV_SERVICIOS + '/' + numberProcess,
      params
    );
  }

  getLOV_TIPOSERVI(
    body: any,
    params?: _Params
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ThirdPartyEndpoints.LOV_TIPOSERVI,
      body,
      params
    );
  }

  getLOV_TURNO(body: any, params?: _Params): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ThirdPartyEndpoints.LOV_TURNO,
      body,
      params
    );
  }

  getLOV_VARCOSTO(body: any, params?: _Params): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ThirdPartyEndpoints.LOV_VARCOSTO,
      body,
      params
    );
  }

  getLOV_CAT3NIVELES(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      ThirdPartyEndpoints.LOV_CAT3NIVELES,
      params
    );
  }
  getQueryVtransferoLevelXcity(
    body: any,
    params?: _Params
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      ThirdPartyEndpoints.QueryVtransferoLevelXcity,
      body,
      params
    );
  }
}
