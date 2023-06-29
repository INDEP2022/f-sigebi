import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';

import { IListResponse } from '../../interfaces/list-response.interface';
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

  goodFinder(params?: _Params) {
    const route = GoodFinderEndpoint.GoodQuery;
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
}
