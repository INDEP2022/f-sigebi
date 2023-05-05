import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodRealState } from '../../models/good/good.model';

@Injectable({
  providedIn: 'root',
})
export class RealStateService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodRealState>> {
    return this.get<IListResponse<IGoodRealState>>('real-state', params);
  }

  getById(id: string | number) {
    const route = `real-state/${id}`;
    return this.get<IListResponse<IGoodRealState>>(route);
  }

  create(good: IGoodRealState): Observable<IGoodRealState> {
    return this.post('real-state', good);
  }

  update(good: IGoodRealState) {
    const route = `real-state`;
    return this.put(route, good);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete('real-state');
  }
}
