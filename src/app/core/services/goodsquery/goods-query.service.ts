import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodsQueryService {
  constructor(private httpClient: HttpClient) {}

  getFractions(body: any) {
    return this.httpClient.post(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getFranction`,
      body
    );
  }

  getLigieUnitDescription(unit: string) {
    return this.httpClient.get(
      `${environment.API_URL}goodsquery/api/v1/ligie-units-measure/getDescription/${unit}`
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
}
