import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitCostEndpoints } from 'src/app/common/constants/endpoints/unit-cost-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUnitCost } from '../../models/administrative-processes/unit-cost.model';

@Injectable({
  providedIn: 'root',
})
export class UnitCostService extends HttpService {
  constructor() {
    super();
    this.microservice = UnitCostEndpoints.BasePath;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IUnitCost>> {
    return this.get<IListResponse<IUnitCost>>(
      UnitCostEndpoints.UnitCost,
      params
    );
  }

  update(id: string | number, model: IUnitCost) {
    const route = `${UnitCostEndpoints.UnitCost}/${id}`;
    return this.put(route, model);
  }

  create(model: IUnitCost) {
    return this.post(UnitCostEndpoints.UnitCost, model);
  }

  remove(id: string | number) {
    const route = `${UnitCostEndpoints.UnitCost}/${id}`;
    return this.delete(route);
  }
}
