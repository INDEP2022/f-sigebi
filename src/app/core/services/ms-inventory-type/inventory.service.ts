import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IInventoryGood,
  ILineaInventory,
} from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService extends HttpService {
  constructor() {
    super();
    this.microservice = 'inventory';
  }

  getInventoryByGood(
    goodId: number,
    params: ListParams
  ): Observable<IListResponse<any>> {
    const route = `inventory-x-good?filter.goodNumber=$eq:${goodId}`;
    return this.get(route, params);
  }

  getPerson(params: ListParams): Observable<IListResponse<any>> {
    const route = `application/getPerson`;
    return this.get(route, params);
  }

  getLinesInventory(params: ListParams) {
    const route = `lines-inventory`;
    return this.get(route, params);
  }

  updateLinesInventory(model: ILineaInventory) {
    const route = `lines-inventory`;
    return this.put(route, model);
  }

  createLinesInventory(model: ILineaInventory) {
    const route = `lines-inventory`;
    return this.post(route, model);
  }

  create(model: IInventoryGood) {
    const route = 'inventory-x-good';
    return this.post<IInventoryGood>(route, model);
  }
}
