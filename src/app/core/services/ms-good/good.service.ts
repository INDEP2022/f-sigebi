import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { environment } from './../../../../environments/environment';

import {
  GoodGetData,
  IGood,
  IGoodCharge,
  IGoodSami,
  IValidaCambioEstatus,
  IVban,
} from '../../models/ms-good/good';

import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IGoodDesc } from '../../models/ms-good/good-and-desc.model';
import {
  IGoodScreenACtionStatusProcess,
  IGoodStatusFinalProcess,
  IGoodStatusProcess,
} from '../../models/ms-good/status-and-process.model';
import {
  GoodActaConvertion,
  GoodEndpoints,
} from './../../../common/constants/endpoints/ms-good-endpoints';

@Injectable({
  providedIn: 'root',
})
export class GoodService extends HttpService {
  good$ = new EventEmitter<IGood>();

  constructor(private http: HttpClient) {
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

  PAValidaCambio(model: IValidaCambioEstatus) {
    return this.post<IResponse>(GoodEndpoints.PAValidaCambioEstatus, model);
  }

  getActAccount(model: IGoodStatusProcess) {
    return this.post<IResponse<{ actNumber: number }>>(
      GoodEndpoints.GoodGetActAccount,
      model
    ).pipe(map(x => (x.count === 0 ? 0 : x.data ? x.data.actNumber : 0)));
  }

  getStatusAndProcess(model: IGoodScreenACtionStatusProcess) {
    return this.post<IGoodStatusFinalProcess>(
      GoodEndpoints.GoodGetStatusAndProcess,
      model
    ).pipe(
      map(x => {
        console.log(x);
        return { status: x.statusFinal, process: x.process };
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
  getAllFilterClassification(
    classifGoodNumber?: string
  ): Observable<IListResponse<any>> {
    const URL = `${environment.API_URL}/goodsquery/api/v1/${GoodEndpoints.AttribGood}?filter.classifGoodNumber=${classifGoodNumber}`;
    const headers = new HttpHeaders();
    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
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

  getByGoodNumber(goodId: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponseMessage<IGood>>(
      `${route}?filter.goodId=$eq:${goodId}`
    );
  }

  getByIdAndGoodId(id: string | number, goodId: string | number) {
    const route = `${GoodEndpoints.GetGoodById}/${id}/${goodId}`;
    return this.get<IGood>(route);
  }

  create(good: IGood) {
    return this.post(GoodEndpoints.Good, good);
  }

  updateCustom(good: IGood) {
    return this.put(GoodEndpoints.Good + '/update-custom/' + good.goodId, {
      extDomProcess: good.extDomProcess,
      description: good.description,
      observations: good.observations,
      status: good.status,
    });
  }

  //
  update(good: IGood | any) {
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

  updateGoodStatusAndDate(goodNumber: number | string, status: string) {
    const route = `${GoodEndpoints.Good}/update-status-and-date-reception`;
    return this.put(route, { goodNumber, status });
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete(route);
  }

  removeGood(body: Object) {
    const route = `${GoodEndpoints.Good}`;
    return this.delete(route, body);
  }

  //http://sigebimsqa.indep.gob.mx/good/api/v1/good/expedient/search?expedient=13132
  getByExpedient(
    expedient: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    // if (params) {
    //   params['expedient'] = expedient;
    // }
    const route = `${GoodEndpoints.SearchByExpedient}/${expedient}`;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getByExpedient1(
    idExpedient: number | string
  ): Observable<IListResponse<IGood>> {
    const route = GoodEndpoints.SearchByExpedient;
    return this.get<IListResponse<IGood>>(route);
  }

  getGoodAndDesc(goodId: number | string) {
    const route = `${GoodEndpoints.GoodAndDesc}/${goodId}`;
    return this.get<IGoodDesc>(route);
  }

  getByWarehouse(
    body: Object,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}/getGoodByWarehouse?search=${params.text}`;
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

  getStatusGood(params?: string) {
    return this.get<IListResponse>(`${GoodEndpoints.OnlyStatus}?${params}`);
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

  getAttributesGood(goodI: any) {
    const URL = `${environment.API_URL}/good/api/v1/${GoodEndpoints.AttribGood}/${goodI}`;

    const headers = new HttpHeaders();

    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }
  getGetReferenceGoodgoodI(goodI: any) {
    const URL = `${environment.API_URL}/good/api/v1/good/get-reference-good/${goodI}`;
    const headers = new HttpHeaders();
    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }

  getGoods(goodI: any) {
    const URL = `${environment.API_URL}/good/api/v1/${GoodEndpoints.Good}?filter.goodId=$eq:${goodI}`;

    const headers = new HttpHeaders();

    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }

  getGoodRealDocums(goodI: any) {
    const URL = `${environment.API_URL}/good/api/v1/${GoodEndpoints.Good}?filter.goodId=$eq:${goodI}`;

    const headers = new HttpHeaders();

    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }

  crateGood(payload: any) {
    const URL = `${environment.API_URL}/good/api/v1/${GoodEndpoints.Good}`;

    const headers = new HttpHeaders();

    return this.http.post<any>(URL, payload).pipe(map(res => res));
  }

  updateWithParams(good: any) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  getGoodById(id: string | number) {
    const route = `${GoodEndpoints.GetGoodById}/${id}/${id}`;
    return this.get<any>(route);
  }

  getByExpedientAndParams(
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = GoodEndpoints.GetAllGoodQuery;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getMassiveSearch(body: any) {
    return this.post(GoodEndpoints.GetMassiveSearch, body);
  }

  getByExpedientAndParams__(
    params?: ListParams
  ): Observable<IListResponse<IGoodSami>> {
    const route = GoodEndpoints.Good;
    return this.get<IListResponse<IGoodSami>>(route, params);
  }

  getFactaDbOficioGestrel(body: {
    no_of_gestion: string | number;
    no_bien: string | number;
  }) {
    return this.get('good/get-facta-dbo-ficio-gestrel', body);
  }

  getActasConversion(actaConvertion: any) {
    const URL = `${environment.API_URL}/convertiongood/api/v1/${GoodActaConvertion.GoodActaConvertion}/get-all?filter.cveActaConvId=$eq:${actaConvertion}`;
    const headers = new HttpHeaders();

    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }
  getFolioActaConversion(actaConvertion: any) {
    const URL = `${environment.API_URL}/convertiongood/api/v1/conversions/procedure/fConvBienHijos?cve_acta_conv=${actaConvertion}`;
    const headers = new HttpHeaders();

    return this.http.get<any>(URL, { headers: headers }).pipe(map(res => res));
  }

  createActaConversion(payload: any) {
    const URL = `${environment.API_URL}/convertiongood/api/v1/${GoodActaConvertion.GoodActaConvertion}`;

    return this.http.post<any>(URL, payload).pipe(map(res => res));
  }
  updateGoodsRev(params?: any): Observable<IListResponse<any>> {
    return this.put(GoodEndpoints.GoodsMotivesrev2, params);
  }

  generateWeaponKey(payload: any) {
    const URL = `${environment.API_URL}/parametergood/api/v1/application/pup-weapon-key`;

    return this.http.post<any>(URL, payload).pipe(map(res => res));
  }

  pupValidMasiv(body: any) {
    return this.post<any>('good/pupValidMasiv2', body);
  }

  getRegistrosProgramados(params: ListParams) {
    return this.get<IListResponse<any>>(
      GoodEndpoints.TmpTotGoodsProgrammed,
      params
    );
  }
  chargeGoods(body: IGoodCharge, params?: string) {
    return this.post<any>('good/charge-goods', body, params);
  }

  chargeGoodsExcel(body: IGoodCharge) {
    return this.post<any>('good/charge-goods-excel', body);
  }

  getByExpedientV2(
    expedient: number | string,
    params?: string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.SearchByExpedient}/${expedient}`;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getGoodSolNumerary(good: number) {
    return this.get(`${GoodEndpoints.GoodNumberSol}/${good}`);
  }
}
