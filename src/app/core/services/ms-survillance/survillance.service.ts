import { Injectable } from '@angular/core';
import { SurvillanceEndpoints } from 'src/app/common/constants/endpoints/ms-survillance';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IGeoreferencieObject,
  IPolVigilancePerGood,
  IViewVigDelegations,
  IVigBinnacle,
  IVigProcessPercentages,
} from '../../models/ms-survillance/survillance';

@Injectable({
  providedIn: 'root',
})
export class SurvillanceService extends HttpService {
  private readonly route = SurvillanceEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Survillance;
  }

  getVCuentaNoBien(no_bien: number | string) {
    return this.get<IListResponse<{ count: number }>>(
      this.route.VCuentaPaqDestion + '?no_bien=' + no_bien
    );
  }

  getVigProcessPercentages(params?: _Params) {
    return this.get<IListResponse<IVigProcessPercentages>>(
      this.route.VigProcessPercentages,
      params
    );
  }

  getGeoreferencieObject(params?: _Params) {
    return this.get<IListResponse<IGeoreferencieObject>>(
      this.route.Georeferencie,
      params
    );
  }

  getGeoreferencieObjectById(id: number) {
    return this.get<IGeoreferencieObject>(this.route.Georeferencie + '/' + id);
  }

  getViewVigDelegations(params?: _Params) {
    return this.get<IListResponse<IViewVigDelegations>>(
      this.route.View_VigDelegations,
      params
    );
  }

  postGeoreferencieObject(model: IGeoreferencieObject) {
    return this.post(this.route.Georeferencie, model);
  }

  putGeoreferencieObject(model: IGeoreferencieObject) {
    return this.put(this.route.Georeferencie, model);
  }

  postVigProcessPercentages(data: IVigProcessPercentages) {
    return this.post(this.route.VigProcessPercentages, data);
  }

  putVigProcessPercentages(id: number, data: IVigProcessPercentages) {
    return this.put(`${this.route.VigProcessPercentages}`, data);
  }

  deleteVigProcessPercentages(data: any) {
    return this.delete(`${this.route.VigProcessPercentages}`, data);
  }

  getVigBinnacle(params?: _Params) {
    return this.get<IListResponse<IVigBinnacle>>(
      this.route.VigBinnacle,
      params
    );
  }

  postDeletePeriod(data: any) {
    return this.post(this.route.DeletePeriod, data);
  }

  postRecordRandom(data: any) {
    return this.post(this.route.RecordRandom, data);
  }

  postValidPeriod(data: any) {
    return this.post(this.route.ValidPeriod, data);
  }

  postPeriods(data: any) {
    return this.post(this.route.Periods, data);
  }

  postChangePeriod(data: any) {
    return this.post(this.route.ChangePeriod, data);
  }

  postChangeGoodAle(data: any) {
    return this.post(this.route.ChangeGoodAle, data);
  }

  getVigSupervisionMae(params: _Params) {
    return this.get<IListResponse<any>>(this.route.VigSupervisionMae, params);
  }

  getVigSupervisionDet(params?: ListParams) {
    return this.get<IListResponse<any>>(this.route.VigSupervisionDet, params);
  }

  getVigSupervisionTmp(params?: ListParams) {
    return this.get<IListResponse<any>>(this.route.VigSupervisionTMP, params);
  }

  deleteVigSupervisionTmp(params?: ListParams) {
    return this.post<IListResponse<any>>(
      this.route.DeleteVigSupervisionTMP,
      params
    );
  }

  createVigSupervisionTmp(params?: ListParams) {
    return this.post<IListResponse<any>>(this.route.VigSupervisionTMP, params);
  }

  getIndMoneda(idProcnum: number | string) {
    const route = `application/get-getIndMoneda?id_procnum=${idProcnum}`;
    return this.get<IListResponse<any>>(route);
  }

  fCalculaNume(idProcnum: number | string, commisionBanc: number) {
    const route = `${this.route.FCalculaNume}/${idProcnum}/${commisionBanc}`;
    return this.get<IListResponse<any>>(route);
  }

  PostInsertSupervisionTmp(formData?: any) {
    return this.post(this.route.PostInsertSupervisionTmp, formData);
  }

  getContract(params?: ListParams) {
    //const route = `${this.route.FCalculaNume}/${idProcnum}/${commisionBanc}`;
    return this.get<IListResponse<any>>(this.route.GetContract, params);
  }

  createVigPerGood(model: any) {
    return this.post<IListResponse<any>>(this.route.VigilancePerGood, model);
  }

  updatePolVigPerGood(model: IPolVigilancePerGood) {
    return this.put<IListResponse<any>>(this.route.PolVigilancePerGood, model);
  }

  getTransNumerarioReg(id: string) {
    let query = '?id_solnum=' + id;
    return this.get<IListResponse<any>>(this.route.GetTransNumerario, query);
  }

  getVigPerGood(params: ListParams) {
    return this.get<IListResponse<any>>(this.route.VigilancePerGood, params);
  }

  getVigSupervisionAllExcel(params: _Params) {
    return this.get<IListResponse<any>>(this.route.VigAllExcel, params);
  }

  getVigSupervisionDet_(params?: _Params) {
    return this.get<IListResponse<any>>(this.route.VigSupervisionDet, params);
  }

  getFaEtapaAnexo(date: { faFec: string }) {
    return this.post(this.route.FaEtapanexo, date);
  }
  getViewVigDelegations_(params?: _Params) {
    return this.get<IListResponse<IViewVigDelegations>>(
      this.route.View_VigDelegations_,
      params
    );
  }
}
