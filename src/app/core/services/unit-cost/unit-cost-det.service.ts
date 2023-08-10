import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitCostDetEndpoints } from 'src/app/common/constants/endpoints/unit-cost-det.endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IUnitCostDet } from '../../models/administrative-processes/unit-cost-det.model';

@Injectable({
  providedIn: 'root',
})
export class UnitCostDetService extends HttpService {
  constructor() {
    super();
    this.microservice = UnitCostDetEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IUnitCostDet>> {
    return this.get<IListResponse<IUnitCostDet>>(
      UnitCostDetEndpoints.UnitCost,
      params
    );
  }

  update(id: string | number, model: IUnitCostDet): Observable<IUnitCostDet> {
    const route = `${UnitCostDetEndpoints.UnitCost}/${id}`;
    return this.put(route, model);
  }

  update1(model: IUnitCostDet): Observable<IUnitCostDet> {
    const route = `${UnitCostDetEndpoints.UnitCost}`;
    return this.put(route, model);
  }

  create(model: IUnitCostDet): Observable<IUnitCostDet> {
    return this.post(UnitCostDetEndpoints.UnitCost, model);
  }

  create1(model: IUnitCostDet): Observable<IUnitCostDet> {
    return this.post(UnitCostDetEndpoints.UnitCost, model);
  }

  remove(body: any) {
    const route = `${UnitCostDetEndpoints.UnitCost}`;
    return this.delete(route, body);
  }
}
