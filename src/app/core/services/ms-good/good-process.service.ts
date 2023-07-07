import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { GoodSubtype } from 'src/app/pages/juridical-processes/juridical-ruling-g/juridical-ruling-g/model/good.model';
import { IResponse } from '../../interfaces/list-response.interface';
import {
  IAcceptGoodActa,
  IAcceptGoodStatus,
  IAcceptGoodStatusScreen,
  IGoodAndDetailProceeding,
  ILvlPrograma,
  IValNumeOtro,
} from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class GoodProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
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
    return this.post('application/get-conv-good-children', body);
  }
}
