import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

import { GoodFinderEndpoint } from './../../../common/constants/endpoints/ms-good-endpoints';

@Injectable({
  providedIn: 'root',
})
export class GoodDataAsetService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodFinderEndpoint.GoodDataAsetBase;
  }

  updateGoodFinderRecord(goodId: string | number, id: string | number) {
    const route = GoodFinderEndpoint.UpdateRecords;
    return this.get(`${route}?nobien=${goodId}&idbien=${id}`);
  }
}
