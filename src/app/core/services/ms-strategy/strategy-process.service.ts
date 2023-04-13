import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyProcess } from '../../models/ms-strategy-process/strategy-process.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyProcessService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyProcess>> {
    return this.get<IListResponse<IStrategyProcess>>(
      StrategyEndpoints.StrategyProcess,
      params
    );
  }

  create(model: IStrategyProcess) {
    return this.post(StrategyEndpoints.StrategyProcess, model);
  }

  update(model: IStrategyProcess, id: number | string) {
    const route = `${StrategyEndpoints.StrategyProcess}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyProcess}/${id}`;
    return this.delete(route);
  }
}
