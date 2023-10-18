import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { NumDetGood } from 'src/app/pages/administrative-processes/numerary/numerary-request/models/goods-det';
import { MassiveGoodEndpoints } from '../../../common/constants/endpoints/ms-massivegood-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPackageInfo } from '../../models/catalogs/package.model';
import {
  IIdentifierCount,
  IMassiveGoodTracker,
  IPupValidMassive,
} from '../../models/ms-massivegood/massive-good-goods-tracker.model';
import { IMassiveGood } from '../../models/ms-massivegood/massivegood.model';

@Injectable({
  providedIn: 'root',
})
export class MassiveGoodService extends HttpService {
  private readonly route = MassiveGoodEndpoints;

  constructor() {
    super();
    this.microservice = this.route.MassiveGood;
  }

  pupBienesPlano(request: any, fileNumber: any) {
    return this.post<any>(
      `application/pupBienesPlano?fileNumber=${fileNumber}`,
      request
    );
  }

  getAll(params?: ListParams): Observable<IListResponse<IMassiveGood>> {
    return this.get<IListResponse<IMassiveGood>>(
      this.route.MassiveChargeGoods,
      params
    );
  }
  postGoodsSchedules(body: any) {
    return this.post(this.route.GoodsShedules, body);
  }
  getAllWithFilters(
    params2?: string,
    params?: ListParams
  ): Observable<IListResponse<IMassiveGood>> {
    return this.get<IListResponse<IMassiveGood>>(
      `${this.route.MassiveChargeGoods}${params2}`,
      params
    );
  }

  getIdentifier(params: ListParams) {
    return this.get(MassiveGoodEndpoints.getIdentifierCount, params);
  }

  getById(id: string | number): Observable<IMassiveGood> {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.get(route);
  }

  getObtnGoodExcel(id: string | number) {
    const route = `${this.route.ObtnGoodPag}?filter.clasif=$in:${id}`;
    return this.get(route);
  }

  create(body: IMassiveGood) {
    return this.post(this.route.MassiveChargeGoods, body);
  }

  update(id: string | number, body: Partial<IMassiveGood>) {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.delete(route);
  }

  countMassiveGood(id: number): Observable<{ data: number }> {
    return this.get<{ data: string }>(
      `${this.route.CountMassiveGood}/${id}`
    ).pipe(
      map(resp => {
        return { data: Number(resp.data) };
      })
    );
  }

  massivePropertyExcel(body: { base64: string }) {
    return this.post(this.route.MassivePropertyExcel, body);
  }

  deleteMassiveGoodComer(good: number) {
    return this.delete(`${this.route.DeleteMassiveGood}/${good}`);
  }
  cargueMassiveGoodConversion(
    params?: ListParams
  ): Observable<IListResponse<IMassiveGood>> {
    return this.get<IListResponse<IMassiveGood>>(this.route.Massive, params);
  }

  getWheelNotificationsByExpedientNumber(goodNumber: string) {
    const route = `${this.route.GetFlierNumberMassiveGood}/${goodNumber}`;
    return this.get(route);
  }

  getDatosCSV() {
    return this.post(this.route.GetFileCSV, '');
  }
  updateMassiveGoods(body: {}) {
    const route = `${this.route.MassiveChargeGoods}/update-massive-goods`;
    return this.put(route, body);
  }

  goodTracker(body: any) {
    const route = `application/goodTracker`;
    return this.post<IMassiveGoodTracker>(route, body);
  }

  chargeGoodsByExpedient(expedient: number | string) {
    const route = MassiveGoodEndpoints.chargeGoodByExpedient;
    return this.get(`${route}/${expedient}`);
  }

  pufVerificaComers(body: any) {
    const route = `findica/pup-verif-comer`;
    return this.post<IMassiveGoodTracker>(route, body);
  }

  pubExport(body: IPackageInfo) {
    const route = `application/pup-export`;
    return this.post(route, body);
  }

  getIdentifierCount(
    params: ListParams
  ): Observable<IListResponse<IIdentifierCount>> {
    const route = `application/getIdentifierCount`;
    return this.get(route, params);
  }

  getDataCSVFile(currency: string, file: any) {
    const formData = new FormData();
    formData.append('tCurrency', currency);
    formData.append('file', file);
    return this.post<IListResponse<NumDetGood>>(this.route.FileCSV, formData);
  }

  getBanVal(status: string) {
    const route = `application/act-bdc-change-status`;
    return this.get(`${route}/${status}`);
  }

  getFProRecPag2CSV(params: _Params, file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(this.route.GetFProRecPag2CSV, formData, params);
  }

  download(formData: string, params: ListParams): Observable<any> {
    const header: Object = {
      responseType: 'arraybuffer',
    };
    return this.post(this.route.GetFProRecPag2CSV, formData, params);
  }

  postPupCargaCsv(
    file: File,
    vc_pantalla: string
  ): Observable<{
    bienes: IPupValidMassive[];
    errores: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vc_pantalla', vc_pantalla);
    return this.post(this.route.PupCargaCsv, formData);
  }

  createProgGoodMassive(data: Object) {
    return this.post(this.route.MassiveProgGood, data);
  }
  GetAllGoodsMotivesRevExcel(params: _Params) {
    return this.get(this.route.GetAllGoodsMotivesRevExcel, params);
  }

  GetExportDataExcelMenaje(params: _Params) {
    return this.get(this.route.ExportDataExcelMenaje, params);
  }

  AttendedPorGoodReasonRev(formData: any) {
    return this.post(this.route.PorGoodReasonRev, formData);
  }
  exportXlsx(params: any) {
    return this.post(MassiveGoodEndpoints.UdateInventory, params);
  }

  postExportDataExcel(params: any) {
    return this.post(MassiveGoodEndpoints.ExportDataExcel, params);
  }

  importExcellGoodsInvoice(data: {
    pSession: number;
    user: string;
    file: any;
  }) {
    const formData = new FormData();

    formData.append('file', data.file);
    formData.append('user', data.user);
    formData.append('pSession', String(data.pSession));

    return this.post(MassiveGoodEndpoints.ImportGoodsInvoice, formData);
  }

  exportSampleGoods(_params: ListParams) {
    const params = this.makeParams(_params);
    return this.get(`${MassiveGoodEndpoints.ExportSampleGoods}?${params}`);
  }

  exportGoodProgramming(_params: ListParams) {
    const params = this.makeParams(_params);
    return this.get(`${MassiveGoodEndpoints.ExportGoodProgramming}?${params}`);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  getCSVStatus(status: number) {
    return this.get(`${MassiveGoodEndpoints.ApplicationCSV}?status=${status}`);
  }
}
