import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { HistoryOfficialEndpoints } from '../../../common/constants/endpoints/ms-historyofficial-endpoints';
import { IHistoryOfficial } from '../../models/ms-historyofficial/historyofficial.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryOfficialService extends HttpService {
  private readonly route = HistoryOfficialEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IHistoryOfficial>> {
    return this.get<IListResponse<IHistoryOfficial>>(
      this.route.HistoryOffice,
      params
    );
  }

  getById(body: {
    flyerNumber: string | number;
    reassignmentDate: string | Date;
  }): Observable<IHistoryOfficial> {
    return this.post(this.route.FindByIds, body);
  }

  create(body: IHistoryOfficial) {
    return this.post(this.route.HistoryOffice, body);
  }

  update(body: Partial<IHistoryOfficial>) {
    return this.put(this.route.HistoryOffice, body);
  }

  remove(body: {
    flyerNumber: string | number;
    reassignmentDate: string | Date;
  }) {
    return this.delete(this.route.HistoryOffice, body);
  }
}
