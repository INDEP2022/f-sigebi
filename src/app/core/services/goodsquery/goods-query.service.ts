import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AttribClassifGoodMethodsRepository } from 'src/app/common/repository/repositories/attrib-classif-good-repository';
import { MsGoodQueryRepository } from 'src/app/common/repository/repositories/ms-good-query-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZipCodeGoodQuery } from '../../models/catalogs/zip-code.model';
import {
  IAttribClassifGoods,
  IUnityByClasif,
} from '../../models/ms-goods-query/attributes-classification-good';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodsQueryService extends HttpService {
  private routeLigieUnitMeasure = GoodsQueryEndpoints.LigieUnitMeasure;
  private zipCodeRoute = GoodsQueryEndpoints.ZipCode;
  private attribClassifGoodRoute = GoodsQueryEndpoints.AttribClassifBood;
  private routeGoodsProg = GoodsQueryEndpoints.ProgrammingGood;
  private atributeClassificationGood: GoodsQueryEndpoints.AtributeClassificationGood;
  private catMeasureUnitsView: GoodsQueryEndpoints.MeasureUnitsView;

  private goodQueryRepository = inject(MsGoodQueryRepository);
  private attribClassifGoodMethodsRepository = inject(
    AttribClassifGoodMethodsRepository
  );

  constructor() {
    super();
    this.microservice = 'goodsquery';
  }

  getFractions(body: any) {
    return this.httpClient.post(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getFranction`,
      body
    );
  }

  getLigieUnitDescription(unit: string) {
    return this.goodQueryRepository.getDescriptionUnitLigie(
      this.routeLigieUnitMeasure,
      unit
    );
  }

  getFractionsByClasifNum(clasifNum: number) {
    return this.httpClient.get(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getView/${clasifNum}`
    );
  }

  getNoms(satUniqueKey: string) {
    return this.httpClient.get(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getNoms/${satUniqueKey}`
    );
  }

  getFractionsFilter(params: ListParams, body: any) {
    return this.httpClient.post<IListResponse<any>>(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getFranctionFilter`,
      body,
      { params }
    );
  }

  postGoodsProgramming(
    _params: ListParams,
    filterColumns: Object
  ): Observable<IListResponse<any>> {
    const params = this.makeParams(_params);
    return this.httpClient.post<IListResponse<any>>(
      `${environment.API_URL}${this.routeGoodsProg}?${params}`,
      filterColumns
    );
  }

  //realiza un Post para obtener los ligies
  getUnitLigie(params: Object): Observable<any> {
    return this.goodQueryRepository.getUnitLigie(
      this.routeLigieUnitMeasure,
      params
    );
  }

  //realiza un Get para obtener las unidades
  getUnitLigies(params: ListParams): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(this.routeLigieUnitMeasure, params);
  }

  getZipCode(
    _params?: ListParams
  ): Observable<IListResponse<IZipCodeGoodQuery>> {
    return this.goodQueryRepository.getAllPaginated(this.zipCodeRoute, _params);
  }

  getBySssubType(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IAttribClassifGoods>> {
    return this.attribClassifGoodMethodsRepository.getBySssubType(
      this.attribClassifGoodRoute,
      id,
      params
    );
  }

  getAllFilter(
    params?: string
  ): Observable<IListResponse<IAttribClassifGoods>> {
    return this.get(`${this.attribClassifGoodRoute}?${params}`);
  }

  create(model: IAttribClassifGoods): Observable<IAttribClassifGoods> {
    return this.attribClassifGoodMethodsRepository.create(
      this.attribClassifGoodRoute,
      model
    );
  }

  update(model: IAttribClassifGoods): Observable<Object> {
    return this.attribClassifGoodMethodsRepository.update(
      this.attribClassifGoodRoute,
      model
    );
  }

  // remove(id: string | number): Observable<Object> {
  //   return this.attribClassifGoodMethodsRepository.remove(this.attribClassifGoodRoute, id);
  // }

  // Se cambia getClasifXUnit por getUnit
  getClasifXUnitByClasifNum(clasifNum: number) {
    return this.httpClient.get<IListResponse<IUnityByClasif>>(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getUnit/${clasifNum}`
    );
  }

  getZStatusCatPhasePart(status: string) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}goodsquery/api/v1/z-status-cat-phase-part/check-status-masiv/${status}`
    );
  }

  getAtributeClassificationGood(params: ListParams) {
    return this.goodQueryRepository.getAllPaginated(
      this.atributeClassificationGood,
      params
    );
  }

  getCatStoresView(_params: ListParams): Observable<IListResponse<any>> {
    const route = `goodsquery/api/v1/views/cat-store-view`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}${route}?${params}`
    );
  }

  getHistoryIndicatorsView(params: _Params) {
    return this.get('views/history-indicator-view', params);
  }

  getCatMeasureUnitView(param: ListParams | string) {
    return this.get(`views/catMeasureUnitsView`, param);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
  getAtribuXClasif(_params: _Params) {
    return this.get<IListResponse<IAttribClassifGoods>>(
      GoodsQueryEndpoints.AtributesClassificationGood,
      _params
    );
  }
}
