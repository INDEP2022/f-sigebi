import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MsGoodQueryRepository } from 'src/app/common/repository/repositories/ms-good-query-repository';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZipCodeGoodQuery } from '../../models/catalogs/zip-code.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsQueryService {
  private routeLigieUnitMeasure = GoodsQueryEndpoints.LigieUnitMeasure;
  private zipCodeRoute = GoodsQueryEndpoints.ZipCode;

  private goodQueryRepository = inject(MsGoodQueryRepository);

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
}
