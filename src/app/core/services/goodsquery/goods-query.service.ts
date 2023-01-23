import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZipCodeGoodQuery } from '../../models/catalogs/zip-code.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsQueryService {
  private readonly route: string = ENDPOINT_LINKS.GoodsQuery;
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

  getZipCode(
    _params?: ListParams
  ): Observable<IListResponse<IZipCodeGoodQuery>> {
    const params = _params ? this.makeParams(_params) : {};
    return this.httpClient.get<IListResponse<IZipCodeGoodQuery>>(
      `${environment.API_URL}goodsquery/api/v1/views/catCodesPostalView`,
      { params }
    );
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key] ?? '');
    });
    return httpParams;
  }
}
