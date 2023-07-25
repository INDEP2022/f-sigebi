import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-numerary';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IMassiveReqNumEnc,
  INumerary,
  IProccesNum,
  IPupAssociateGood,
  IRequesNum,
  IRequesNumeraryCal,
  IRequesNumeraryDet,
  IRequesNumMov,
  IRequestNumeraryEnc,
  ISearchNumerary,
} from '../../models/ms-numerary/numerary.model';

@Injectable({
  providedIn: 'root',
})
export class NumeraryService extends HttpService implements ICrudMethods<any> {
  private readonly route = NumeraryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Numerary;
  }

  validateCvs(body: any): Observable<any> {
    return this.get(this.route.ValidateCvs, body);
  }

  getAll(params?: ListParams): Observable<IListResponse<INumerary>> {
    return this.get(NumeraryEndpoints.RateInt, params);
  }

  getAllWithFilter(params?: string): Observable<IListResponse<INumerary>> {
    return this.get(NumeraryEndpoints.RateInt, params);
  }

  create(model: INumerary): Observable<INumerary> {
    return this.post(NumeraryEndpoints.RateInt, model);
  }

  createChangeNumerary(model: any): Observable<any> {
    return this.post(NumeraryEndpoints.RequestChangeNumerary, model);
  }

  createSolCamNum(model: any): Observable<any> {
    return this.post(NumeraryEndpoints.RequestSolCamNum, model);
  }

  getSolCamNum(params?: ListParams): Observable<any> {
    return this.get(NumeraryEndpoints.RequestSolCamNum, params);
  }

  DeleteOneCamNum(id: number | string) {
    const route = `${NumeraryEndpoints.RequestSolCamNum}/${id}`;
    return this.delete<IListResponse<any>>(route);
  }

  DeleteAllCamNum(id: number | string) {
    const route = `${NumeraryEndpoints.RequestDSolCamNum}/${id}`;
    return this.delete<IListResponse<any>>(route);
  }

  getSolById(id: number | string) {
    const route = `${NumeraryEndpoints.RequestChangeNumerary}/${id}`;
    return this.get<IListResponse<any>>(route);
  }
  remove(id: number) {
    return this.delete(`${NumeraryEndpoints.RateInt}/${id}`);
  }

  update(id: number, body: INumerary) {
    return this.put(`${NumeraryEndpoints.RateInt}/${id}`, body);
  }

  getNumeraryCategories(params?: _Params) {
    return this.get(NumeraryEndpoints.NumeraryCategories, params);
  }

  getNumeraryRequestNumeEnc(params?: ListParams) {
    return this.get<IListResponse<IRequestNumeraryEnc>>(
      NumeraryEndpoints.RequestEnc,
      params
    );
  }

  getNumeraryRequestNumeEncFilter(params?: string) {
    return this.get<IListResponse<IRequestNumeraryEnc>>(
      NumeraryEndpoints.RequestEnc,
      params
    );
  }

  getNumeraryRequestNumeDet(params?: ListParams) {
    return this.get<IListResponse<IRequesNumeraryDet>>(
      NumeraryEndpoints.RequestDet,
      params
    );
  }

  getNumeraryRequestNumeCal(params?: ListParams) {
    return this.get<IListResponse<IRequesNumeraryCal>>(
      NumeraryEndpoints.RequestCal,
      params
    );
  }

  deleteProccess(procNum: number): Observable<any> {
    const model = {
      procNum: procNum,
    };
    return this.post('application/fp-sol-numerary', model);
  }

  pupSonDate(model: {
    lvIdSolnum: string | number;
    lvIdProcnum: string | number;
    lvBpParcializado: string | number;
  }) {
    return this.post('application/pup-son-date', model);
  }

  pupSonDelDate(model: Object) {
    return this.post('application/pup-son-del-date', model);
  }

  pupElimCalculNume(model: Object) {
    return this.post('application/pup-del-calc-numerary', model);
  }

  fCalculaNume(model: Object) {
    return this.post('', model);
  }

  getProccesNum(params?: ListParams) {
    return this.get<IListResponse<IProccesNum>>(
      NumeraryEndpoints.ProcessesNume,
      params
    );
  }

  getProcessNumById(id: number): Observable<IProccesNum> {
    return this.get<IListResponse<IProccesNum>>(
      NumeraryEndpoints.ProcessesNume,
      { 'filter.procnumId': id, limit: 1 }
    ).pipe(map(res => res.data[0]));
  }

  createProccesNum(model: IProccesNum) {
    return this.post<IListResponse<IProccesNum>>(
      NumeraryEndpoints.ProcessesNume,
      model
    );
  }

  getAllProccesNum(
    params?: ListParams
  ): Observable<IListResponse<IProccesNum>> {
    return this.get<IListResponse<IProccesNum>>(
      NumeraryEndpoints.ProcessesNume,
      params
    );
  }

  getAllCloseNumerary(params?: ListParams): Observable<IListResponse<any>> {
    return this.get(NumeraryEndpoints.CloseNumerary, params);
  }

  updateNumeraryRequestNumeEnc(model: IRequestNumeraryEnc, id: string) {
    const route = `${NumeraryEndpoints.RequestEnc}/${id}`;
    return this.put<IRequestNumeraryEnc>(route, model);
  }

  updateMasiveReqNumEnc(model: IMassiveReqNumEnc) {
    return this.post('requests-nume-enc/update-masive', model);
  }

  getSolNumerary(model: any, params?: ListParams) {
    return this.post<IListResponse<IRequestNumeraryEnc>>(
      NumeraryEndpoints.GetSolNumerario,
      model,
      params
    );
  }

  pupSearchNumerary(body: ISearchNumerary) {
    return this.post(`application/pup-search-numerary`, body);
  }

  getAllRequestNume(params?: string) {
    return this.get(`request-nume`, params);
  }

  createRequestNume(body: IRequesNum) {
    return this.post('request-nume', body);
  }

  getAllRequestNumMov(params?: string) {
    return this.get(`nume-request-movi`, params);
  }

  createRequestNumMov(body: IRequesNumMov) {
    return this.post(`nume-request-movi`, body);
  }

  pupAssociateGood(body: IPupAssociateGood) {
    return this.post('application/pup-associate-good-func', body);
  }

  reqNumEnc(params: string) {
    return this.get('application/reqNumEnc', params);
  }
}
