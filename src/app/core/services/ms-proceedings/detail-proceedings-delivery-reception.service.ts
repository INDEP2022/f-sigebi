import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDeleteDetailProceeding,
  IDetailProceedings,
  IDetailProceedingsDeliveryReception,
  IDetailWithIndEdo,
} from '../../models/ms-proceedings/detail-proceedings-delivery-reception.model';
@Injectable({
  providedIn: 'root',
})
export class DetailProceeDelRecService extends HttpService {
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getGoodsByProceedings(id: string | number, params?: ListParams) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}?filter.numberProceedings=$eq:${id}`;
    return this.get(route, params);
  }

  updateGoodsByProceedings(model: IDetailProceedings) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}`;
    return this.put(route, model);
  }
  getGoodsByProceeding(params: HttpParams) {
    const route = `proceedings-delivery-reception`;
    return this.get(route, params);
  }

  putProceedingsDeliveryReception(body: any, id: number) {
    const route = `proceedings-delivery-reception/${id}`;
    return this.put(route, body);
  }

  PADelActaEntrega(actNumber: string | number) {
    return this.delete(`${ProceedingsEndpoints.PADelActaEntrega}/${actNumber}`);
  }

  editDetailProcee(model: IDetailProceedingsDeliveryReception) {
    return this.put(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  addGoodToProceedings(model: Partial<IDetailProceedingsDeliveryReception>) {
    return this.post(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  deleteDetailProcee(model: IDeleteDetailProceeding) {
    return this.delete(
      ProceedingsEndpoints.DetailProceedingsDeliveryReception,
      model
    );
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      'detail-proceedings-delivery-reception',
      params
    );
  }

  getAllwithEndFisico(model: IDetailWithIndEdo) {
    return this.post(
      'detail-proceedings-delivery-reception/get-detalle-acta-recepcion',
      model
    );
  }

  postRegister(body: any) {
    return this.post('detail-proceedings-delivery-reception', body);
  }

  deleteRegister(body: any) {
    return this.delete('detail-proceedings-delivery-reception', body);
  }

  remove(numberGood: string | number, numberProceedings: string | number) {
    return this.delete('detail-proceedings-delivery-reception', {
      numberGood,
      numberProceedings,
    });
  }

  getReport(report: number) {
    const route = `${ProceedingsEndpoints.GetProcedding}/${report}`;
    return this.get(route);
  }

  getByExpedient(report: number | string) {
    const route = `${ProceedingsEndpoints.GetCustom}?filter.fileNumber.filesId=$eq:${report}`;
    return this.get(route);
  }

  getbyfile(params: any) {
    const route = `${ProceedingsEndpoints.getAct}`;
    return this.post(route, params);
  }

  getProcedingbyId(id: number | string) {
    const route = `${ProceedingsEndpoints.ProeedingsDevolution}/${id}`;
    return this.get(route);
  }
  getProceding(report: number | string) {
    const route = `${ProceedingsEndpoints.proceedingGet}/${report}`;
    return this.get(route);
  }

  getProcedingbykey(key: number | string) {
    const route = `${ProceedingsEndpoints.procedingDelivery}?filter.keysProceedings=$eq:${key}`;
    return this.get(route);
  }

  getProceedingbyId(id: number) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}?filter.numberProceedings=$eq:${id}`;
    return this.get(route);
  }

  getProceedingByNoGood(id: number) {
    const route = `${ProceedingsEndpoints.DetailProceedingsDeliveryReception}?filter.numberGood=$eq:${id}`;
    return this.get(route);
  }

  getProceedingStatus(id: number) {
    const route = `${ProceedingsEndpoints.procedingActa}/${id}`;
    return this.get(route);
  }

  putActaStatus(id: number, params: any) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}/${id}`;
    return this.put(route, params);
  }

  getProcedingbyKey(numFile: number, key: any, id: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}?filter.typeProceedings=$eq:CONSENTR&filter.numFile=$eq:${numFile}&filter.keysProceedings=$ilike:${key}&filter.id=$eq:${id}`;
    return this.get(route);
  }

  getProcedingByType(id: number, params?: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}?filter.typeProceedings=$eq:CONSENTR&filter.numFile=$eq:${id}`;
    return this.get(route, params);
  }

  postProceeding(params: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}`;
    return this.post(route, params);
  }

  getMconsmassive(user: any, params?: any) {
    const route = `${ProceedingsEndpoints.SearchMcons}?filter.user=$ilike:${user}`;
    return this.get(route, params);
  }

  getDconsmassive(expedient: any, user: any) {
    const route = `${ProceedingsEndpoints.SearchDcons}?filter.user=$ilike:${user}&filter.fileNumber.filesId=$eq:${expedient}`;
    return this.get(route);
  }

  getDetailProceeding(Acta: any) {
    const route = `${ProceedingsEndpoints.detailProceeding}?filter.numberProceedings=$eq:${Acta}`;
    return this.get(route);
  }

  getMconsmassiveConstancia(user: any, params?: any) {
    const route = `${ProceedingsEndpoints.SearchMcons}?filter.fileValue=$ilike:S&filter.user=$ilike:${user}`;
    return this.get(route, params);
  }

  pupArmaClave(params: any) {
    const route = `${ProceedingsEndpoints.pupArmaClave}`;
    return this.post(route, params);
  }

  getValidaFolio(cve: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}?filter.typeProceedings=$ilike:CONSENTR&filter.keysProceedings=$ilike:${cve}`;
    return this.get(route);
  }

  getCount(id: number) {
    const route = `${ProceedingsEndpoints.getCount}/${id}`;
    return this.get(route);
  }

  getGoodStatus(params: any) {
    const route = `${ProceedingsEndpoints.getProceedings}`;
    return this.post(route, params);
  }

  getProcedingbyIdAct(id: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}?filter.id=$eq:${id}`;
    return this.get(route);
  }

  PutProcedingbyIdAct(id: any, params?: any) {
    const route = `${ProceedingsEndpoints.proceedingDelivery}/${id}`;
    return this.put(route, params);
  }

  getByUserTmpEst(user: any, params?: any) {
    const route = `${ProceedingsEndpoints.TmpEspPrograming}?filter.userEst=$ilike:${user}`;
    return this.get(route, params);
  }

  getProcedingImp(params: ListParams) {
    const receive = 'S';
    const route = `${ProceedingsEndpoints.ActasRecptionImp}?filter.received=${receive}`;
    return this.get(route, params);
  }
}
