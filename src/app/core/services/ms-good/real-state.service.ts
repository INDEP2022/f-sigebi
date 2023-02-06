import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodDomicilies } from '../../models/good/good.model';

@Injectable({
  providedIn: 'root',
})
export class RealStateService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodDomicilies>> {
    return this.get<IListResponse<IGoodDomicilies>>('real-state', params);
  }

  getById(id: string | number) {
    const route = `real-state/${id}`;
    return this.get<IListResponse<IGoodDomicilies>>(route);
  }

  create(good: IGoodDomicilies) {
    return this.post('real-state', good);
  }

  update(id: string | number, good: IGoodDomicilies) {
    const route = `real-state/${id}`;
    return this.put(route, good);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete('real-state');
  }
}
