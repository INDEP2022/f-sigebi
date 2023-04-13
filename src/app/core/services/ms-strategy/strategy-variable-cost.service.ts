import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyVariableCost } from '../../models/ms-strategy-variable-cost/strategy-variable-cost.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyVariableCostService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyVariableCost>> {
    return this.get<IListResponse<IStrategyVariableCost>>(
      StrategyEndpoints.StrategyVariableCost,
      params
    );
  }

  create(model: IStrategyVariableCost) {
    return this.post(StrategyEndpoints.StrategyVariableCost, model);
  }

  update(model: IStrategyVariableCost, id: number | string) {
    const route = `${StrategyEndpoints.StrategyVariableCost}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyVariableCost}/${id}`;
    return this.delete(route);
  }
}
