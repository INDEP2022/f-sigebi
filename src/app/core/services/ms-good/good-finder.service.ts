import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

import { GoodFinderEndpoint } from './../../../common/constants/endpoints/ms-good-endpoints';

@Injectable({
  providedIn: 'root',
})
export class GoodFinderService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodFinderEndpoint.GoodFinderBase;
  }

  goodFinder(params?: ListParams | string) {
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
}
