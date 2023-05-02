import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITempExpedient } from '../../models/ms-expedient/tmp-expedient.model';

@Injectable({
  providedIn: 'root',
})
export class TmpExpedientService extends HttpService {
  private readonly route = ExpedientEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITempExpedient>> {
    return this.get<IListResponse<ITempExpedient>>(
      this.route.TmpExpedients,
      params
    );
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<ITempExpedient>> {
    return this.get<IListResponse<ITempExpedient>>(
      this.route.TmpExpedients,
      params
    );
  }

  getById(id: string | number): Observable<ITempExpedient> {
    const route = `${this.route.TmpExpedients}/${id}`;
    return this.get(route);
  }

  create(body: ITempExpedient): Observable<ITempExpedient> {
    return this.post(this.route.TmpExpedients, body);
  }

  update(id: string | number, body: ITempExpedient) {
    const route = `${this.route.TmpExpedients}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.TmpExpedients}/${id}`;
    return this.delete(route);
  }
}
