import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
@Injectable({
  providedIn: 'root',
})
export class ProgrammingGoodsService extends HttpService {
  constructor() {
    super();
    this.microservice = 'programminggood';
  }
  getAll(data: any, _params?: _Params) {
    const params = this.getParams(_params);
    const route = `${environment.API_URL}catalog/api/v1/apps/getProgrammingGoodsIn`;
    return this.httpClient.post<IListResponse<any>>(route, data, { params });
  }
  computeEntities(P_NOACTA: number | string, P_AREATRA: string) {
    return this.post('programminggood/apps/compute-entities', {
      P_NOACTA,
      P_AREATRA,
    });
  }
  PaCierreInicialProgr(
    P_NOACTA: number | string,
    P_PANTALLA: string,
    P_ACCION: string | number
  ) {
    console.log({
      P_NOACTA,
      P_PANTALLA,
      P_ACCION,
    });
    return this.post('programminggood/apps/initial-closing-program', {
      P_NOACTA,
      P_PANTALLA,
      P_ACCION,
    });
  }
  tmpEstGoodsProgr(params?: ListParams) {
    return this.get<IListResponse<any>>('/tmp-est-goods-prog', params);
  }
  /// /api/v1/tmp-est-goods-prog
}
