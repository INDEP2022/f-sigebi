import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';

import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
import { GoodFinderEndpoint } from './../../../common/constants/endpoints/ms-good-endpoints';

@Injectable({
  providedIn: 'root',
})
export class GoodFinderService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodFinderEndpoint.GoodFinderBase;
  }

  getAll(params?: _Params) {
    const route = GoodFinderEndpoint.GoodQuery;
    return this.get<IListResponseMessage<IGood>>(route, params).pipe(
      map(x => {
        return {
          ...x,
          data: x.data.map(good => {
            return { ...good, select: false };
          }),
        };
      })
    );
  }

  goodFinder(params?: _Params) {
    const route = GoodFinderEndpoint.GoodQuery;
    return this.get(route, params);
  }

  goodFinder2(name: string, params?: _Params) {
    const route = `${GoodFinderEndpoint.GoodQuery}?filter.goodDescription=$ilike:${name}`;
    return this.get(route, params);
  }

  masiveClassificationGood(
    requestId: number | string,
    fractionId: number | string,
    type: number | string
  ) {
    const route = GoodFinderEndpoint.MasiveClassification;
    return this.get(
      `${route}/request/${requestId}/fraction/${fractionId}/type/${type}`
    );
  }

  masiveAssignationDomicileGood(
    requestId: number | string,
    addressId: number | string
  ) {
    const route = GoodFinderEndpoint.AssignDomicilie;
    return this.get(`${route}/request/${requestId}/domicile/${addressId}`);
  }

  updateStatusProcess(body: any) {
    const route = GoodFinderEndpoint.UpdateGoodStatus;
    return this.post(`${route}`, body);
  }

  ableTosignDictamination(request: number) {
    const route = GoodFinderEndpoint.AbleToSignDistamen;
    return this.get(`${route}/request/${request}`);
  }

  getAll2(params?: string) {
    return this.get<IListResponse<IGood>>(`good-query?${params}`);
  }
  getAll3(params?: ListParams) {
    return this.get<IListResponse<IGood>>(`good-query`, params);
  }
}
