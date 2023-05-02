import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyService } from '../../models/ms-strategy-service/strategy-service.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyServiceService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyService>> {
    return this.get<IListResponse<IStrategyService>>(
      StrategyEndpoints.StrategyService,
      params
    );
  }

  create(model: IStrategyService) {
    return this.post(StrategyEndpoints.StrategyService, model);
  }

  update(model: IStrategyService, id: number | string) {
    const route = `${StrategyEndpoints.StrategyService}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyService}/${id}`;
    return this.delete(route);
  }
}
