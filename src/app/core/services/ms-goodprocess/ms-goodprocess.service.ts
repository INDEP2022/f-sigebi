import { Injectable } from '@angular/core';
import { GoodprocessEndpoints } from 'src/app/common/constants/endpoints/ms-goodprocess-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GoodprocessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodprocessEndpoints.BasePath;
  }

  getById(id: number | string) {
    return this.get<IListResponse<any>>(
      `${GoodprocessEndpoints.AplicationValidStatus}/${id}`
    );
  }

  getTodos(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ApplicationAllFill,
      params
    );
  }

  getExpedientePostQuery(params: any) {
    return this.post(`${GoodprocessEndpoints.ExpedientePostQuery}`, params);
  }

  getCountBienStaScreen(params: any) {
    return this.post(
      `${GoodprocessEndpoints.CountBienEstatusXPantalla}`,
      params
    );
  }

  getDictaminacionesCount(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ApplicationDictaminacionesCount,
      params
    );
  }

  getCuEmisora(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ApplicationCuDelRem,
      params
    );
  }

  getCuDelRem(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ApplicationCuDelRem,
      params
    );
  }

  getCuDelDest(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ApplicationCuDelDest,
      params
    );
  }
}
