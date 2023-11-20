import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDynamicStatusXScreen,
  IGoodStatusScreen,
  IStatus,
  IStatusXScreen,
} from '../../models/ms-screen-status/status.model';
import { ScreenStatusEndpoints } from './../../../common/constants/endpoints/ms-screen-status-endpoint';

@Injectable({
  providedIn: 'root',
})
export class ScreenStatusService extends HttpService {
  private readonly endpoint = ScreenStatusEndpoints;
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  getStatus(filters: IGoodStatusScreen) {
    return this.post<IListResponse<IStatus>>(
      `${this.endpoint.StatusXScreenAndGoods}`,
      filters
    );
  }
  getStatusXScreen(filters: IDynamicStatusXScreen) {
    return this.post<IListResponse<IStatusXScreen>>(
      `${this.endpoint.StatusXScreen}`,
      filters
    );
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IStatusXScreen>>('status-x-screen', params);
  }

  getAllFiltro(params: any) {
    return this.get<IListResponse<any>>(
      `status-x-screen?filter.status=$eq:${params.estatus}&filter.screenKey=$eq:${params.vc_pantalla}`
    );
  }

  getAllFiltroScreenKey(params: any) {
    return this.get<IListResponse<IStatusXScreen>>(
      `status-x-screen?filter.screenKey=$eq:${params.vc_pantalla}`
    );
  }

  getAllFiltro_(params: any) {
    return this.get<IListResponse<IStatusXScreen>>(
      `status-x-screen?filter.status=$eq:${params.estatus}&filter.screenKey=$eq:${params.vc_pantalla}&filter.identifier=$eq:${params.identifier}&filter.processExtSun=$eq:${params.processExtSun}`
    );
  }

  getAllFilterFree(params: string) {
    return this.get<IListResponse<IStatusXScreen>>(`status-x-screen`, params);
  }

  getStatusCheck(data: any) {
    return this.post('application/check-status-good', data);
  }

  getGetGoodScreenStatus(params: any) {
    return this.post<IListResponse<IStatusXScreen>>(
      `${this.endpoint.GetGoodScreenStatus}`,
      params
    );
  }

  postPermissionByScreenAndUser(body: { screen: string; user: string }) {
    return this.post(this.endpoint.PermissionsByScreenAndUser, body);
  }

  postStatusXPant(params: any) {
    const route = `${ScreenStatusEndpoints.statusxpant}`;
    return this.post(route, params);
  }

  getStatusV(params: any) {
    const route = `${ScreenStatusEndpoints.getStatusV}`;
    return this.post(route, params);
  }

  getStatusTA(params: any) {
    const route = `${ScreenStatusEndpoints.GetCount}`;
    return this.post(route, params);
  }

  getStatusScreen(key: any, action: any) {
    const route = `${ScreenStatusEndpoints.StatusXScreenList}?filter.screenKey=$ilike:${key}&filter.action=$ilike:${action}`;
    return this.get(route);
  }

  getStatusandScreen(key: any, status: any) {
    const route = `${ScreenStatusEndpoints.StatusXScreenList}?filter.screenKey=$ilike:${key}&filter.status=$ilike:${status}`;
    return this.get(route);
  }

  getStatusEndforScreen(key: any, status: any, process: any, action: any) {
    const route = `${ScreenStatusEndpoints.StatusXScreenList}?filter.screenKey=$eq:${key}&filter.status=$eq:${status}&filter.processExtSun=$eq:${process}&filter.action=$eq:${action}`;
    return this.get(route);
  }
  getStatusXScreenColor(params: any) {
    return this.get(ScreenStatusEndpoints.StatusXScreenList, params);
  }

  validateDelegationConcept() {
    return this.post;
  }
}
