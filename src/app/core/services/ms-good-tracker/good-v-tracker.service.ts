import { Injectable } from '@angular/core';
import { GoodTrackerEndpoints } from 'src/app/common/constants/endpoints/ms-good-tracker-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { ITVGoodsTracker } from '../../models/ms-good-tracker/vtempTracker.model';

@Injectable({
  providedIn: 'root',
})
export class GoodViewTrackerService extends HttpService {
  constructor() {
    super();
    this.microservice = 'trackergood';
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<ITVGoodsTracker>>(
      GoodTrackerEndpoints.ViewTracker,
      params
    );
  }
}
