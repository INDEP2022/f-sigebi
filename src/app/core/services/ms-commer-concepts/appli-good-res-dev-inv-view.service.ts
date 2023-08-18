import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComerConceptEndpoints } from 'src/app/common/constants/endpoints/ms-comerconcept';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsResDev } from '../../models/ms-rejectedgood/goods-res-dev-model';

@Injectable({
  providedIn: 'root',
})
export class AppliGoodResDevViewService extends HttpService {
  constructor() {
    super();
    this.microservice = 'comerconcepts';
  }

  getAll(_params: ListParams): Observable<IListResponse<IGoodsResDev>> {
    const params = this.makeParams(_params);
    let route = ComerConceptEndpoints.GoodResDevInvView;
    return this.get<IListResponse<IGoodsResDev>>(`${route}?${params}`);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
