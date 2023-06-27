import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodTrackerEndpoints } from 'src/app/common/constants/endpoints/ms-good-tracker-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { Iidentifier } from '../../models/ms-good-tracker/identifier.model';
import { ITmpTracker } from '../../models/ms-good-tracker/tmpTracker.model';
import { ITrackedGood } from '../../models/ms-good-tracker/tracked-good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodTrackerService extends HttpService {
  constructor() {
    super();
    this.microservice = 'trackergood';
  }

  getAll(params?: _Params): Observable<IListResponseMessage<ITrackedGood>> {
    return this.get<IListResponseMessage<ITrackedGood>>(
      'trackergood/apps/goodtrackertmp',
      params
    );
  }

  getAllTmpTracker(params?: _Params): Observable<IListResponse<ITmpTracker>> {
    return this.get<IListResponse<ITmpTracker>>(
      GoodTrackerEndpoints.TmpTracker,
      params
    );
  }

  getAllModal(
    self?: GoodTrackerService,
    params?: _Params
  ): Observable<IListResponse<ITrackedGood>> {
    return self.get<IListResponse<ITrackedGood>>(
      'trackergood/apps/goodtrackertmp',
      params
    );
  }

  getIdentifier() {
    return this.get<Iidentifier>(GoodTrackerEndpoints.GenerateIdentifier);
  }

  createTmpTracker(tmpTracker: ITmpTracker) {
    return this.post(GoodTrackerEndpoints.TmpTracker, tmpTracker);
  }
}
