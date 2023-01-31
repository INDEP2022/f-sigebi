import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class GoodService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(GoodEndpoints.Good, params);
  }

  getById(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.get(route);
  }

  create(good: IGood) {
    return this.post(GoodEndpoints.Good, good);
  }

  update(id: string | number, good: IGood) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.put(route, good);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete(route);
  }

  getByExpedient(
    expedient: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    if (params) {
      params['expedient'] = expedient;
    }
    const route = GoodEndpoints.SearchByExpedient;
    return this.get<IListResponse<IGood>>(route, params);
  }
}
