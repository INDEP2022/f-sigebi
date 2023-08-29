import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { GoodprocessEndpoints } from 'src/app/common/constants/endpoints/ms-goodprocess-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import {
  ICharacteristicsGoodDTO,
  ISecondIfMC,
} from '../../models/ms-good/good';
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

  getScreenGood(model: any): Observable<IListResponse<any>> {
    return this.post(`${GoodprocessEndpoints.consultationScreenGood}`, model);
  }

  getScreenGood2(model: any): Observable<IListResponse<any>> {
    return this.post(`${GoodprocessEndpoints.consultationScreenGood2}`, model);
  }
  getScreenGoodList(payload: any): Observable<any[]> {
    const url = `${GoodprocessEndpoints.consultationScreenGood2}`;
    return this.post(url, payload).pipe(
      map((response: any) => {
        // La respuesta del servicio debe ser un array de objetos con los datos necesarios para actualizar la apariencia visual de las filas de la tabla
        return response.data.map((item: any) => {
          return {
            goodNumber: item.goodNumber,
            vcScreen: item.vcScreen,
          };
        });
      }),
      catchError(error => {
        console.log('error', error);
        return throwError(error);
      })
    );
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

  packageClose(params: any) {
    return this.post(`${GoodprocessEndpoints.PackageClose}`, params);
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

  getVSteeringWhel(data: any) {
    return this.post(GoodprocessEndpoints.AppVWheel, data);
  }

  postFMasInsNumerario(data: any) {
    return this.post('application/fMasInsNumerario', data);
  }

  getByGood_distinctElaborationDate(id: number) {
    return this.get<IListResponse<any>>(
      `${GoodprocessEndpoints.ApplicationDistinctElaborationDate}/${id}`
    );
  }

  firstIfCancelMassiveConversion(body: { noPackage: number }) {
    return this.post('application/update-goods', body);
  }

  secondIfCancelMassiveConversion(body: ISecondIfMC) {
    return this.post('application/fmto-package-procedure', body);
  }

  deleteStatusBien(body: any) {
    return this.post(GoodprocessEndpoints.deleteStatusBien, body);
  }

  insertStatusBien(body: any) {
    return this.post(GoodprocessEndpoints.insertStatusBien, body);
  }

  getGoodType_(params?: _Params) {
    return this.get<IListResponse<any>>(
      GoodprocessEndpoints.GetGoodType,
      params
    );
  }

  getDeleteStatusGoodnumber(body: any) {
    return this.post(GoodprocessEndpoints.DeleteStatusGoodnumber, body);
  }

  exportRejectedGoods(eventId: string | number) {
    return this.get<{ base64File: string }>(
      `application/export-rejected/${eventId}`
    );
  }

  setStatusToSale(body: { goods: (string | number)[] }) {
    return this.post(
      'application/comer-rejectedgoods-no-etq-3-when-button-pressed',
      body
    );
  }

  AddReceptionBpm(idGood: number, goodId: number) {
    return this.get(
      `${GoodprocessEndpoints.ReceptionBpmBackup}/${idGood}/${goodId}`
    );
  }

  getDataFromGood(id: any) {
    const route = `${GoodprocessEndpoints.getDataFromGood}/${id}`;
    return this.get(route);
  }
}
