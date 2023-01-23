import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodsQueryEndpoints } from 'src/app/common/constants/endpoints/ms-good-query-endpoints';
import { MsGoodQueryRepository } from 'src/app/common/repository/repositories/ms-good-query-repository';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class GoodsQueryService {
  private routeLigieUnitMeasure = GoodsQueryEndpoints.LigieUnitMeasure;

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
}
