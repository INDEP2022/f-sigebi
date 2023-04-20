import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGoodsinvEndpoint } from 'src/app/common/constants/endpoints/ms-goodsinv.endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsInv } from '../../models/ms-goodsinv/goodsinv.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsInvService extends HttpService {
  constructor() {
    super();
    this.microservice = IGoodsinvEndpoint.GoodsInv;
  }

  getCatUnitMeasureView(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodsInv>> {
    return this.get<IListResponse<IGoodsInv>>(
      IGoodsinvEndpoint.CatUnitsMeasureView,
      params
    );
  }

  getMunicipalitiesByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetMunicipalityByParams, params);
  }

  getTownshipByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetTownshipByParams, params);
  }

  getCodePostalByStateKey(params: Object) {
    return this.post(IGoodsinvEndpoint.GetCodePostalByParams, params);
  }

  getAllMunipalitiesByFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetMunicipalityByFilter, params);
  }

  getAllTownshipByFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.getTownshipByFilter, params);
  }

  getAllCodePostalByFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCodePostalByFilter, params);
  }

  getAllBrandWithFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCatBrandWithFilter, params);
  }

  getAllSubBrandWithFilter(params: ListParams | string) {
    return this.get(IGoodsinvEndpoint.GetCatSubBrandWithFilter, params);
  }
}
