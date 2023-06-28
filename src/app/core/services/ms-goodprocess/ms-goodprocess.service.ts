import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodprocessEndpoints } from 'src/app/common/constants/endpoints/ms-goodprocess-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { ICharacteristicsGoodDTO } from '../../models/ms-good/good';
import { IGoodDistinctTypes } from '../../models/ms-good/good-distinct-types';

@Injectable({
  providedIn: 'root',
})
export class GoodprocessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodprocessEndpoints.BasePath;
  }

  getById(id: number | string) {
    return this.get<IListResponse<IGoodDistinctTypes>>(
      `${GoodprocessEndpoints.AplicationValidStatus}/${id}`
    );
  }

  getDistinctTypes(model: ICharacteristicsGoodDTO, listParams: ListParams) {
    return this.post<IListResponseMessage<any>>(
      GoodprocessEndpoints.GetDistinctTypes,
      model,
      listParams
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

  getGoodType(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.GetGoodType,
      params
    );
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

  getEtapaByDictation(params?: ListParams) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.ParametersFaStageCreda,
      params
    );
  }

  getQueryVtypeGood(params: any) {
    return this.post(`${GoodprocessEndpoints.QueryVtypeGood}`, params);
  }
  postPupGenMasiv(params: any) {
    return this.post(`${GoodprocessEndpoints.ApplicationPupGenMasiv}`, params);
  }

  getGoodScreenSend(params: any) {
    return this.post(`${GoodprocessEndpoints.GetGoodScreenSend}`, params);
  }

  getNextValManagement() {
    return this.get('application/get-nextval-gestion');
  }
  updateJobManagement(model: any): Observable<IListResponse<any>> {
    return this.post(`${GoodprocessEndpoints.UpdateGoodStatus}`, model);
  }
  postJobManagement(model: any): Observable<IListResponse<any>> {
    return this.post(`${GoodprocessEndpoints.UpdateGoodStatus}`, model);
  }

  getGoodAvailable(params: ListParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    return this.post(
      `application/getAssetsOfficeManagement?page=${page}&limit=${limit}`,
      params
    );
  }

  postTransferGoodsTradeManagement(body: {
    ofManagementNumber: any;
    proceedingsNumber: any;
    goodNumber: any;
  }) {
    this.post('application/transferGoodsTradeManagement', body);
  }

  GetGoodProceedings(params: ListParams) {
    return this.get(`${GoodprocessEndpoints.GetGoodProceedings}`, params);
  }

  getAppliesControl(params: any) {
    return this.post(`${GoodprocessEndpoints.AppliesControl}`, params);
  }
}
