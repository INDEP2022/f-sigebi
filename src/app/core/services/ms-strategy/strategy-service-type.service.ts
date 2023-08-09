import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyServiceType } from '../../models/ms-strategy-service-type/strategy-service-type.model';
import { ITmpStrategyCost } from '../../models/ms-tmp-strategy-cost/tmp-strategy-cost';

@Injectable({
  providedIn: 'root',
})
export class StrategyServiceTypeService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyServiceType>> {
    return this.get<IListResponse<IStrategyServiceType>>(
      StrategyEndpoints.StrategyServiceType,
      params
    );
  }

  getAllTmp(
    params?: ListParams | string
  ): Observable<IListResponse<ITmpStrategyCost>> {
    return this.get<IListResponse<ITmpStrategyCost>>(
      StrategyEndpoints.TmpStrategyCost,
      params
    );
  }

  createTmp(model: any) {
    return this.post(StrategyEndpoints.TmpStrategyCost, model);
  }

  create(model: IStrategyServiceType) {
    return this.post(StrategyEndpoints.StrategyServiceType, model);
  }

  update(model: IStrategyServiceType, id: number | string) {
    const route = `${StrategyEndpoints.StrategyServiceType}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number) {
    const route = `${StrategyEndpoints.StrategyServiceType}/${id}`;
    return this.delete(route);
  }

  postFindByFilter(body: any) {
    const route = `${StrategyEndpoints.postByFilter}`;
    return this.post(route, body);
  }
}
