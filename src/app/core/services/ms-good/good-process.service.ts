import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { GoodSubtype } from 'src/app/pages/juridical-processes/juridical-ruling-g/juridical-ruling-g/model/good.model';
import { IResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
import {
  IAcceptGoodActa,
  IAcceptGoodStatus,
  IAcceptGoodStatusScreen,
  IGoodAndDetailProceeding,
  ILvlPrograma,
  IValNumeOtro,
} from '../../models/ms-good/good';
import { IGoodsResDev } from '../../models/ms-rejectedgood/goods-res-dev-model';

@Injectable({
  providedIn: 'root',
})
export class GoodProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  getReportNingevent(params: ListParams) {
    return this.get(GoodProcessPoints.ReportNingevent, params);
  }

  getReportNingeventExcel(params: ListParams) {
    return this.get(GoodProcessPoints.ReportNingeventExcel, params);
  }

  getReportMonth(params: ListParams) {
    return this.get(GoodProcessPoints.ReportMonth, params);
  }

  getReportMonthExcel(params: ListParams) {
    return this.get(GoodProcessPoints.ReportMonthExcel, params);
  }

  getCheckAllGoodPag(params: ListParams) {
    return this.get(GoodProcessPoints.CheckAllGoodPag, params);
  }

  getCheckAllGoodPagExcel(params: ListParams) {
    return this.get(GoodProcessPoints.CheckAllGoodPagExcel, params);
  }

  getSpObtnxGood(params: ListParams) {
    return this.get(GoodProcessPoints.SpObtnxGood, params);
  }

  getSpObtnxGoodExcel(params: ListParams) {
    return this.get(GoodProcessPoints.SpObtnxGoodExcel, params);
  }

  updateFraction(body: { newFraction: string; goodNum: number }) {
    return this.post(GoodProcessPoints.updateFractions, body);
  }

  getValNume(model: IValNumeOtro) {
    return this.post<IResponse>(GoodProcessPoints.cuValNume, model);
  }

  getValOtro(model: IValNumeOtro) {
    return this.post<IResponse>(GoodProcessPoints.cuValOtro, model);
  }
  getByIdSituation(id: string | number) {
    const route = `${GoodProcessPoints.GetGoodSituation}`;
    return this.get<any>(`${route}/${id}`);
  }
  getVnNumerario(id: string | number) {
    return this.get(`${GoodProcessPoints.vnNumerario}?no_bien=${id}`);
  }

  getLvlPrograma(model: ILvlPrograma) {
    return this.post<IResponse>(GoodProcessPoints.lvlPrograma, model);
  }

  getDetailProceedginGood(model: IGoodAndDetailProceeding) {
    return this.post<IResponse>(GoodProcessPoints.goodAndDetail, model);
  }

  getDetailProceedingGoodFilterNumber(
    model: IGoodAndDetailProceeding,
    noActa: string
  ) {
    return this.post<IResponse>(
      `${GoodProcessPoints.goodAndDetail}?filter.proceedingsnumber=${noActa}`,
      model
    );
  }

  getacceptGoodStatus(model: IAcceptGoodStatus) {
    return this.post<IResponse>(GoodProcessPoints.acceptGoodStatus, model);
  }

  getGoodAppraise(model: any) {
    return this.post<IResponse>(GoodProcessPoints.GetGoodAppraise, model);
  }

  getAccepGoodActa(model: IAcceptGoodActa) {
    return this.post<IResponse>(GoodProcessPoints.acceptGoodActa, model);
  }

  getacceptGoodStatusScreen(model: IAcceptGoodStatusScreen) {
    return this.post<IResponse>(
      GoodProcessPoints.acceptGoodStatusScreen,
      model
    );
  }

  getDateRange(date: string, range: number) {
    const route = `${GoodProcessPoints.dateRange}/${date}/${range}`;
    return this.get(route);
  }

  getFact(data: Object): Observable<IListResponse<GoodSubtype>> {
    return this.post<IListResponse<GoodSubtype>>(
      GoodProcessPoints.getFact,
      data
    );
  }

  getIdent(data: Object): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(GoodProcessPoints.getIdent, data);
  }

  dictationConcilation(data: Object) {
    return this.post<any>(GoodProcessPoints.dicta, data);
  }

  getDicGood(data: Object) {
    return this.post<any>(GoodProcessPoints.getDocGod, data);
  }
  GetVexist(params?: any) {
    return this.get<IListResponse<any>>(
      GoodProcessPoints.GetVexist + `/${params}`
    );
  }
  GetVstatusIniVproextdomIni(params?: any) {
    return this.get<IListResponse<any>>(
      GoodProcessPoints.GetVstatusIniVproextdomIni + `/${params}`
    );
  }

  updateGoodXGoodNumber(params?: any, body?: any) {
    return this.put<IListResponse<any>>(
      GoodProcessPoints.UpdateGoodXGoodNumber + `/${params}`,
      body
    );
  }

  getVstatusIni2(params?: any) {
    return this.post<IListResponse<any>>(
      GoodProcessPoints.GetVstatusIni2,
      params
    );
  }

  GetVstatusIniVproextdomIni2(params?: any) {
    return this.post<IListResponse<any>>(
      GoodProcessPoints.GetVstatusIniVproextdomIni2,
      params
    );
  }

  GetVstatusIniVnoRegisterVproextdomIni(params?: any) {
    return this.post<IListResponse<any>>(
      GoodProcessPoints.GetVstatusIniVnoRegisterVproextdomIni,
      params
    );
  }
  deleteHistoricalStatusGoodXrecord(params?: any) {
    return this.delete<IListResponse<any>>(
      GoodProcessPoints.deleteHistoricalStatusGoodXrecord,
      params
    );
  }
  getVstatusIniVnoRegister(params?: any) {
    return this.post<IListResponse<any>>(
      GoodProcessPoints.getVstatusIniVnoRegister,
      params
    );
  }

  callPupChangeImpro(body: any): Observable<any> {
    const route = GoodProcessPoints.pup_change_impro;
    return this.post(`${route}`, body);
  }

  getDescDepBan(good: number) {
    const route = GoodProcessPoints.GetDescDep;
    return this.get(`${route}/${good}`);
  }

  getLabelDesc(body: {
    transferNumber: string | number;
    clasifGooNumber: string | number;
  }) {
    return this.post('update-good-status/getLabelDescrip', body);
  }

  postExistsGoodxStatus(body: {
    pVcScreem: string;
    goodNumber: string;
    proccesExtDom: string;
  }): Observable<IListResponse<any>> {
    return this.post('application/getExistsGoodxStatus', body);
  }

  postGoodMasiveForm(body: any): Observable<IListResponse<any>> {
    return this.post('application/get-conv-good-children-masive', body);
  }
  getNumeProrraCsv(idProcnum: number) {
    const route = GoodProcessPoints.GetNumeProrraCsv;
    return this.get(`${route}/${idProcnum}`);
  }

  getFproSolNumerarioProdnumCsv(idProcnum: number, limit: number) {
    const route = `${GoodProcessPoints.GetNumeProrraCsv}/${idProcnum}`;
    return this.get(`${route}?limit=${limit}`);
  }

  getPubPrevieData(data: Object) {
    return this.post(GoodProcessPoints.PubPrevieData, data);
  }

  getGoodPostQuery(
    _params: ListParams,
    data: Object
  ): Observable<IListResponse<IGood>> {
    const params = this.makeParams(_params);
    return this.post<IListResponse<IGood>>(
      `${GoodProcessPoints.getGoodPostQuery}?${params}`,
      data
    );
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
  procedureGoodStatus(data: { cveShape: string; noGood: number }) {
    return this.post(GoodProcessPoints.ProcedureStatusGood, data);
  }

  pupReconcilied(
    body: {
      goodNumber: number[];
      arrayStatus: string[];
      dateMasiv: Date | string;
    },
    params?: _Params
  ) {
    return this.post('application/pup-reconcilied', body);
  }

  updateFileNumber(requestId: number, recordId?: number) {
    const body: any = { proceedingsNumber: recordId };
    const route = GoodProcessPoints.UpdateProcedingNumber;
    if (recordId) {
      return this.put(`${route}/${requestId}`, body);
    } else {
      return this.put(`${route}/${requestId}`);
    }
  }

  updateMassiveStore(form: Object) {
    const route = GoodProcessPoints.UpdateMassiveStore;
    return this.put(route, form);
  }

  getDisponible(model: any) {
    return this.post('update-good-status/getOneRegister', model);
  }

  getStatusFinal(model: any) {
    return this.post('update-good-status/getFinalStatus', model);
  }

  getDisponible2(model: any) {
    return this.post('update-good-status/getOneStatus', model);
  }

  getStatusProcess(model: any) {
    return this.post(
      'update-good-status/getStatusProcess?limit=10&page=1',
      model
    );
  }

  getData(params: ListParams) {
    return this.get<IListResponse<any>>('update-good-status/getData', params);
  }

  goodResDevInv(_params: ListParams) {
    const params = this.makeParams(_params);
    return this.get<IListResponse<IGoodsResDev>>(
      `${GoodProcessPoints.GetGoodsResDevInv}?${params}`
    );
  }

  getGoodCustom(currency: string, good: number) {
    return this.get(
      `${GoodProcessPoints.GetDataCustom}?tCurrency=${currency}&noGood=${good}`
    );
  }

  getVGoodTpye(params: ListParams) {
    const route = `${GoodProcessPoints.VGoodType}`;
    return this.get<any>(route, params);
  }

  getVsigLigie(params: ListParams | string): Observable<IListResponse<any>> {
    const route = GoodProcessPoints.GetVsigLigie;
    return this.get<IListResponse<any>>(route, params);
  }

  getComerDetAvaluoAll(goodNumber: number) {
    return this.get(`${GoodProcessPoints.ComerDetAvaluoAll}/${goodNumber}`);
  }

  getStatusNew(filters: any) {
    return this.post<IListResponse<any>>(
      `${GoodProcessPoints.GoodxStatusXtypeNumber}`,
      filters
    );
  }

  getExpedients(model: Object) {
    return this.post(`${GoodProcessPoints.ConsultQuery}`, model);
  }
}
