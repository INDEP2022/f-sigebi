import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { InventoryQueryRepository } from 'src/app/common/repository/repositories/ms-inventory-query-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IInventoryQuery } from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService extends HttpService {
  constructor(
    private requestRepository: InventoryQueryRepository<IInventoryQuery | any>
  ) {
    super();
    this.microservice = 'inventory';
  }

  getInventoryByGood(
    goodId: number,
    params: ListParams
  ): Observable<IListResponse<any>> {
    const route = `application/getInventory/${goodId}`;
    return this.get(route, params);
  }

  getPerson(params: ListParams): Observable<IListResponse<any>> {
    const route = `application/getPerson`;
    return this.get(route, params);
  }
}
