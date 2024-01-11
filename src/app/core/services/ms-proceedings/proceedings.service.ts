import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
  IResponse,
} from '../../interfaces/list-response.interface';
import {
  IAvailableFestatus,
  IBtnAddGood,
  IDetailProceedingsDevollution,
  IDetailProceedingsDevollutionDelete,
  IFactconst,
  IPaConstDelivery,
  IPbSelPaq,
  IProceedings,
  IPufValidTerm,
  IPupMovDestruction,
  IQueryRegAdminGood,
  ITmpCreateAuthoDestroy,
  ITmpUpdateMassive,
  ITmpUpdateOneReg,
  IUpdateActasEntregaRecepcion,
} from '../../models/ms-proceedings/proceedings.model';
import {
  IBlkPost,
  IUpdateVault,
  IUpdateWarehouse,
} from '../../models/ms-proceedings/warehouse-vault.model';
import { ProceedingsEndpoints } from './../../../common/constants/endpoints/ms-proceedings-endpoints';
import {
  ICveAct,
  IUpdateProceedings,
} from './../../models/ms-proceedings/update-proceedings.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsService extends HttpService {
  private readonly route = ProceedingsEndpoints.Proceedings;
  private readonly endpoint = ProceedingsEndpoints.ProeedingsDevolution;
  private readonly endpointU = ProceedingsEndpoints.UpdateActasRDelegation;
  showErrorObs = new BehaviorSubject<boolean>(true);
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  // getAll(params?: ListParams): Observable<IListResponse<IProceedings>> {
  //   return this.get<IListResponse<IProceedings>>(this.endpoint);
  // }
  getTypeActa(body: any, params: ListParams) {
    return this.post<IResponse>(
      ProceedingsEndpoints.AplicationGetTypeActa,
      body,
      params
    );
  }

  getTypeActaDetail(body: any, params: ListParams) {
    return this.post(
      ProceedingsEndpoints.AplicationGetTypeActaDetail,
      body,
      params
    );
  }
  getProceedingsDeliveryReception(params: ListParams) {
    return this.get(ProceedingsEndpoints.ProceedingsDeliveryReception, params);
  }

  updateVaultByProceedingNumber(model: IUpdateVault) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateVaultByProceedingNumber}`,
      model
    );
  }

  updateVaultByKeyProceeding(model: IUpdateVault) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateVaultByKeyProceeding}`,
      model
    );
  }

  updateWarehouseByProceedingNumber(model: IUpdateWarehouse) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateWarehouseByProceedingNumber}`,
      model
    );
  }

  updateWarehouseByKeyProceeding(model: IUpdateWarehouse) {
    return this.post<IResponse>(
      `${this.route}/${ProceedingsEndpoints.UpdateWarehouseByKeyProceeding}`,
      model
    );
  }

  getBiePosquery(model: IBlkPost) {
    return this.post<IResponse>(`${ProceedingsEndpoints.blkBienPost}`, model);
  }
  postBlkConversions(model: any) {
    return this.post<IResponse>(
      `${ProceedingsEndpoints.blkConversions}`,
      model
    );
  }

  getActByFileNumber(
    fileNumber?: number,
    params?: ListParams
  ): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`,
      params
    );
  }

  update(id: string | number, proceeding: IUpdateProceedings) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, proceeding);
  }

  getDetailProceedingsDevolutionByExpedient(
    fileNumber: string | number,
    params?: ListParams
  ) {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`
    );
  }

  getProceedings(params?: ListParams): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      `${this.route}/getAll`,
      params
    );
  }

  getExistProceedings(numberGood: string) {
    return this.get<IListResponseMessage<{ no_acta: string }>>(
      ProceedingsEndpoints.ExistProceedings + '/' + numberGood
    );
  }

  createProceedings(formData: IProceedings) {
    return this.post(this.route, formData);
  }

  getCurTrans(expedientId: string | number) {
    return this.get<{
      no_transferente: string;
      clave: string;
    }>(`application/get-cur-transf/${expedientId}`);
  }

  getCveAct(model: ICveAct) {
    return this.post<IResponse>('aplication/get-detail-acta-types', model);
  }

  remove(proceedingsNumb: number) {
    return this.delete<IListResponse<IProceedings>>(
      `${this.endpoint}/${proceedingsNumb}`
    );
  }
  updateActasEntregaRecepcion(
    model: IUpdateActasEntregaRecepcion,
    no_Acta: string | number
  ) {
    return this.put<IListResponse<any>>(
      `aplication/update-actasEntregaRecepcion/${no_Acta}`,
      model
    );
  }

  updateActasEntregaRTurno(body: any) {
    return this.put<IListResponse<any>>(`${this.endpointU}`, body);
  }

  insertsAndUpdatesValmotosOne(model: Object) {
    return this.post<IListResponse>('aplication/get-detail-acta-types', model);
  }

  updateProceeding(model: Object) {
    return this.put(this.route, model);
  }

  deleteProceeding(model: Object) {
    return this.delete(this.route, model);
  }

  getUnioTable(goodNumber: number, params?: string) {
    return this.get(`${ProceedingsEndpoints.GetUnion}/${goodNumber}`, params);
  }

  getCountActas(goodNumber: number | string) {
    return this.get('aplication/get-count-actas/' + goodNumber);
  }

  getGlobalExpedientF(body: {
    pCveActa: string;
    pGoodNumber: string | number;
    pDelivery: string;
  }) {
    return this.post('aplication/get-global-expedient-f', body);
  }

  getGlobalExpedientF3(body: { pGoodNumber: string; pConstEntKey: string }) {
    return this.post('aplication/get-global-expedient-f-3', body);
  }

  getGlobalExpedientF2(body: {
    pGoodNumber: number | string;
    pRecepCan: string;
    pSuspension: string;
    pCveActa: string;
  }) {
    return this.post('aplication/get-global-expedient-f-2', body);
  }

  getSteeringWheelNumber(body: {
    pExpedientNumber: string | number;
    pGoodNumber: string | number;
  }) {
    return this.post('application/get-v-steeringwheel-number', body);
  }

  getGetFactDbConvBien(good: any, exp: any) {
    return this.get<IResponse>(
      `${ProceedingsEndpoints.GetFactDbConvBien}?no_bien=${good}&no_expediente=${exp}`
    );
  }
  getGetFactCir(good: any, exp: any) {
    return this.get<IResponse>(
      `${ProceedingsEndpoints.GetFacCircuNr}?no_bien=${good}&no_expediente=${exp}`
    );
  }

  creaDetailProceedingsDevollution(good: any) {
    return this.post<IResponse>(
      `${ProceedingsEndpoints.DetailProceedingsDevollution}`,
      good
    );
  }

  getDetailProceedingsDevollution(params: any) {
    return this.get<IResponse>(
      `${ProceedingsEndpoints.DetailProceedingsDevollution}`,
      params
    );
  }

  deleteDetailProceedingsDevollution(params: any) {
    return this.delete<IResponse>(
      `${ProceedingsEndpoints.DetailProceedingsDevollution}`,
      params
    );
  }

  pupLaunchesReport(body: any) {
    return this.post('aplication/get-pup-lanza-reporte', body);
  }

  pupLaunchesReport2(body: any) {
    return this.post('aplication/get-pup-lanza-reporte-2', body);
  }

  getTmpTotExpProceedings(params: ListParams) {
    return this.get<IListResponse<any>>('tmp-tot-exp-proceedings', params);
  }

  getTmpTotGoodsProceedings(params: ListParams) {
    return this.get<IListResponse<any>>('tmp-tot-goods-proceedings', params);
  }

  getAct(model: any) {
    return this.post<IListResponse<any>>('aplication/getAct', model);
  }

  createDetailProceedingsDevolution(model: IDetailProceedingsDevollution) {
    return this.post(
      `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`,
      model
    );
  }

  getDetailProceedingsDevolution(params: ListParams) {
    return this.get<IListResponse<IDetailProceedingsDevollution>>(
      `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`,
      params
    );
  }

  deleteDetailProceedingsDevolution(
    model: IDetailProceedingsDevollutionDelete
  ) {
    return this.delete(
      `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`,
      model
    );
  }

  updateDetailProceedingsDevolution(model: IDetailProceedingsDevollution) {
    return this.put(
      `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`,
      model
    );
  }

  getEventByProceeding(minutes: string) {
    return this.post<IListResponse<{ programmingId: string; eventId: string }>>(
      'aplication/getMinutesDeliveryReception',
      { minutes }
    );
  }

  deleteProceedingById(id: any) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`;
    return this.delete(route);
  }

  postConstDelivery(params: any) {
    const route = `${ProceedingsEndpoints.constDelivery}`;
    return this.post(route, params);
  }

  postConstGood(params: any) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`;
    return this.post(route, params);
  }

  deleteReception(params: any) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`;
    return this.delete(route, params);
  }

  consultPaValMasive(screen: string) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}/FACTCONST_0001`;
    return this.get(`aplication/pa-val-const-masive/${screen}`);
  }

  pufValidTerm(body: IPufValidTerm) {
    return this.post<{ vban: boolean }>('aplication/puf-valid-term', body);
  }

  pbSelPaq(body: IPbSelPaq) {
    return this.post('aplication/pb-sel-paq', body);
  }

  pupMovementDestruction(body: IPupMovDestruction) {
    return this.post('aplication/cursor-pup-movement-act-destructuion', body);
  }

  queryRegAdminGood(body: IQueryRegAdminGood) {
    return this.post('aplication/query-reg-del-admin-good', body);
  }

  getAvailableFestatus(body: IAvailableFestatus) {
    return this.post('aplication/getAvailable', body);
  }

  tmpAuthorizationsDestruction(
    user: string,
    proceeding?: string,
    params?: string
  ) {
    return this.get(
      proceeding != null
        ? `detail-proceedings-delivery-reception/tmp/?user=${user}&proceeding=${proceeding}`
        : `detail-proceedings-delivery-reception/tmp/?user=${user}`,
      params
    );
  }

  tmpUpdateMassive(body: ITmpUpdateMassive) {
    return this.post(
      'detail-proceedings-delivery-reception/update-massive',
      body
    );
  }

  tmpCreateAuthorization(body: ITmpCreateAuthoDestroy) {
    return this.post(
      'detail-proceedings-delivery-reception/create-massive',
      body
    );
  }

  tmpUpdateOneReg(body: ITmpUpdateOneReg) {
    return this.post(
      'detail-proceedings-delivery-reception/update-status',
      body
    );
  }

  pupFillDist(acta: string) {
    return this.get(`aplication/pup-full-dist/${acta}`);
  }

  postqueryFactConst(body: IFactconst) {
    return this.post('aplication/blk-bie-post-query', body);
  }

  btnAddGood(body: IBtnAddGood) {
    return this.post('aplication/btn-add-good', body);
  }

  paConstDelivery(body: IPaConstDelivery) {
    return this.post('aplication/pa-const-delivery', body);
  }
}
