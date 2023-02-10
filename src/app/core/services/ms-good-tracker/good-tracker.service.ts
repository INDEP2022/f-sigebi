import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITrackedGood } from '../../models/ms-good-tracker/tracked-good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodTrackerService extends HttpService {
  constructor() {
    super();
    this.microservice = 'trackergood';
  }

  getAll(params?: _Params): Observable<IListResponse<ITrackedGood>> {
    return this.get<IListResponse<ITrackedGood>>(
      'trackergood/apps/goodtrackertmp',
      params
    );
  }
}
