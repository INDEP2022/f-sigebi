import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IServiceGood } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class ServiceGoodService extends HttpService {
  private readonly route = 'policy';
  constructor() {
    super();
    this.microservice = 'servicegood';
  }

  getAll(params?: ListParams): Observable<IListResponse<IServiceGood>> {
    const route = 'services-x-good';
    return this.get<IListResponse<IServiceGood>>(route, params);
  }

  create(model: IServiceGood): Observable<IServiceGood> {
    const route = 'services-x-good';
    return this.post(route, model);
  }
}
