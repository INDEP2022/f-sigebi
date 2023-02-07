import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AttribClassifGoodMethodsRepository } from 'src/app/common/repository/repositories/attrib-classif-good-repository';
import { MsGoodQueryRepository } from 'src/app/common/repository/repositories/ms-good-query-repository';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZipCodeGoodQuery } from '../../models/catalogs/zip-code.model';
import { IAttribClassifGoods } from '../../models/ms-goods-query/attributes-classification-good';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodsQueryService {
  private routeLigieUnitMeasure = GoodsQueryEndpoints.LigieUnitMeasure;
  private zipCodeRoute = GoodsQueryEndpoints.ZipCode;
  private attribClassifGoodRoute = GoodsQueryEndpoints.AttribClassifBood;

  private goodQueryRepository = inject(MsGoodQueryRepository);
  private attribClassifGoodMethodsRepository = inject(
    AttribClassifGoodMethodsRepository
  );

  constructor(private httpClient: HttpClient) {}

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

  getUnitLigie(params: Object): Observable<any> {
    return this.goodQueryRepository.getUnitLigie(
      this.routeLigieUnitMeasure,
      params
    );
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
}
