import { EventEmitter, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IResponse,
} from '../../interfaces/list-response.interface';
import {
  IDescriptionByNoGoodBody,
  IDescriptionByNoGoodResponse,
  IFromGoodsAndExpedientsBody,
  IFromGoodsAndExpedientsResponse,
  IGoodSearchGoodByClasification,
  IGoodSearchGoodByFile,
} from '../../models/good/good.model';
import { ITrackedGood } from '../../models/ms-good-tracker/tracked-good.model';

import {
  GoodGetData,
  IGood,
  IGoodSami,
  IVban,
} from '../../models/ms-good/good';

import { IGoodDesc } from '../../models/ms-good/good-and-desc.model';
import {
  IGoodScreenACtionStatusProcess,
  IGoodStatusFinalProcess,
  IGoodStatusProcess,
} from '../../models/ms-good/status-and-process.model';
import { GoodEndpoints } from './../../../common/constants/endpoints/ms-good-endpoints';

@Injectable({
  providedIn: 'root',
})
export class GoodService extends HttpService {
  good$ = new EventEmitter<IGood>();

  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(GoodEndpoints.Good, params);
  }

  getAllSiab(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodSami>> {
    return this.get<IListResponse<IGoodSami>>(
      GoodEndpoints.GoodGetSiab,
      params
    );
  }
  getVBan(array: IVban) {
    return this.post<IResponse>(GoodEndpoints.Vban, array);
  }

  getActAccount(model: IGoodStatusProcess) {
    return this.post<IResponse>(GoodEndpoints.GoodGetActAccount, model).pipe(
      map(x => x.count)
    );
  }

  getStatusAndProcess(model: IGoodScreenACtionStatusProcess) {
    return this.post<IResponse<IGoodStatusFinalProcess>>(
      GoodEndpoints.GoodGetStatusAndProcess,
      model
    ).pipe(
      map(x => {
        console.log(x);
        return { status: x.data.statusFinal, process: x.data.process };
      })
    );
  }

  getValidMassiveDownload(goodId: number) {
    return this.get<IResponse>(
      GoodEndpoints.GoodValidMassiveDownload + '/' + goodId
    ).pipe(map(x => x.count));
  }

  getValigFlag(goodId: number) {
    return this.get<IResponse>(GoodEndpoints.GoodValidFlag + '/' + goodId).pipe(
      map(x => {
        console.log(x);
        return x.message[0];
      })
    );
  }

  getValigSat(goodId: number) {
    return this.get<IResponse>(GoodEndpoints.GoodValidSat + '/' + goodId).pipe(
      map(x => x.message[0])
    );
  }

  getValidSeq() {
    return this.post<{ max: string }>(GoodEndpoints.GoodValidSeq, {}).pipe(
      map(x => {
        console.log(x);
        return +x.max;
      })
    );
  }

  getForParcBien(params?: string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      GoodEndpoints.Good + '/searchGoods',
      params
    );
  }

  getData(goodData: GoodGetData): Observable<IListResponse<IGood>> {
    return this.post(GoodEndpoints.GoodGetDat, goodData);
  }

  getAllFilter(params?: string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(`${GoodEndpoints.Good}?${params}`);
  }

  getAllFilterDetail(params?: string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}/getAllGoodWDetail?${params}`
    );
  }

  getMeasurementUnits(unit: string) {
    return this.get<
      IResponse<{
        decimales: string;
      }>
    >(`${GoodEndpoints.Good}/searchUnit/${unit}`);
  }

  getGoodWidthMeasure(id: string | number) {
    return this.get<
      IListResponse<{
        cantidad: string;
        descripcion: string;
        cve_moneda_avaluo: string;
      }>
    >(`${GoodEndpoints.GoodWidthMeasure}/${id}`);
  }

  getById(id: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IGood>(`${route}?filter.id=$eq:${id}`);
  }

  getByIdAndGoodId(id: string | number, goodId: string | number) {
    const route = `${GoodEndpoints.GetGoodById}/${id}/${goodId}`;
    return this.get<IGood>(route);
  }

  create(good: IGood) {
    return this.post(GoodEndpoints.Good, good);
  }

  //
  update(good: IGood) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  updateWithoutId(good: IGood) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  updateGoodStatusMassive(goodNumbers: number[] | string[], status: string) {
    return forkJoin(
      goodNumbers.map(goodNumber => {
        return this.updateGoodStatus(goodNumber, status);
      })
    );
  }

  updateGoodStatus(goodNumber: number | string, status: string) {
    const route = `${GoodEndpoints.Good}/updateGoodStatus/${goodNumber}/${status}`;
    return this.put(route);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete(route);
  }

  removeGood(body: Object) {
    const route = `${GoodEndpoints.Good}`;
    return this.delete(route, body);
  }

  getByExpedient(
    expedient: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    if (params) {
      params['expedient'] = expedient;
    }
    const route = GoodEndpoints.SearchByExpedient;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getGoodAndDesc(goodId: number | string) {
    const route = `${GoodEndpoints.GoodAndDesc}/${goodId}`;
    return this.get<IGoodDesc>(route);
  }

  getByWarehouse(
    body: Object,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}/getGoodByWarehouse`;

    return this.post<IListResponse<IGood>>(route, body);
  }
  getByExpedientAndStatus(
    expedient: string | number,
    status: string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.fileNumber=$eq:${expedient}&filter.status=$eq:${status}`;
    return this.get<IListResponse<IGood>>(route, params);
  }
  getStatusByGood(idGood: string | number): Observable<any> {
    const route = `${GoodEndpoints.StatusAndDesc}/${idGood}`;
    return this.get<any>(route);
  }

  getBySafe(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.vaultNumber=$eq:${id}`;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getGoodByStatusPDS(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(route, params);
  }
  updateTracked(id: string | number, good: ITrackedGood) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.put(route, good);
  }

  getExemptedGoods(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.extDomProcess=TRANSFERENTE`;
    const route2 = `${GoodEndpoints.Good}?filter.goodId=2203409`;
    return this.get<IListResponse<IGood>>(route2, params);
  }

  getGoodByStatusPDSelect(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.status=PDS`,
      params
    );
  }

  getGoodsByExpedientAndStatus(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.fileNumber=$eq:${id}&filter.status=RGA`,
      params
    );
  }
  getDescriptionGoodByNoGood(body: IDescriptionByNoGoodBody) {
    return this.post<IListResponse<IDescriptionByNoGoodResponse>>(
      GoodEndpoints.DiStatusGood,
      body
    );
  }
  getFromGoodsAndExpedients(body: IFromGoodsAndExpedientsBody) {
    return this.post<IListResponse<IFromGoodsAndExpedientsResponse>>(
      GoodEndpoints.GoodByDepositaryGood,
      body
    );
  }
  getSearchGoodByFile(body: IGoodSearchGoodByFile) {
    return this.post<IListResponse<IGood>>(
      GoodEndpoints.SearchGoodByFile,
      body
    );
  }
  getSearchGoodByClasif(body: IGoodSearchGoodByClasification) {
    return this.post<IListResponse<IGood>>(
      GoodEndpoints.SearchGoodByClasif,
      body
    );
  }

  changeGoodToNumerary(body: any) {
    return this.post(GoodEndpoints.CreateGoodNumerary, body);
  }

  updateWithParams(good: any) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  getGoodById(id: string | number) {
    const route = `${GoodEndpoints.GetGoodById}/${id}/${id}`;
    return this.get<any>(route);
  }
}
