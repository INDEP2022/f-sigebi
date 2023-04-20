import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStrategyShift } from '../../models/ms-strategy-shift/strategy-shift.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyShiftService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStrategyShift>> {
    return this.get<IListResponse<IStrategyShift>>(
      StrategyEndpoints.StrategyShift,
      params
    );
  }

  create(model: IStrategyShift) {
    return this.post(StrategyEndpoints.StrategyShift, model);
  }

  update(model: IStrategyShift, id: number | string) {
    const route = `${StrategyEndpoints.StrategyShift}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number): Observable<Object> {
    const route = `${StrategyEndpoints.StrategyShift}/${id}`;
    return this.delete(route);
  }
}
