import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_INVENTORY } from 'src/app/common/constants/endpoints/ms-inventory-query';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { InventoryQueryRepository } from 'src/app/common/repository/repositories/ms-inventory-query-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IInventoryQuery,
  TypesInventory,
} from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryTypeService
  extends HttpService
  implements ICrudMethods<IInventoryQuery | TypesInventory>
{
  private readonly route: string = ENDPOINT_INVENTORY.inventory;
  private readonly routeDetail: string = ENDPOINT_INVENTORY.inventoryDetail;

  constructor(
    private requestRepository: InventoryQueryRepository<IInventoryQuery | any>
  ) {
    super();
    this.microservice = 'inventoryquery';
  }

  getAllWithFilters(
    params: _Params
  ): Observable<IListResponse<TypesInventory>> {
    return this.get(this.route, params);
  }

  getInventotyById(id: string | number): Observable<TypesInventory> {
    return this.requestRepository.getById(this.route, id);
  }

  createInventory(
    model: TypesInventory
  ): Observable<IListResponse<IInventoryQuery | TypesInventory>> {
    return this.requestRepository.create(this.route, model);
  }

  updateInventory(id: string, model: TypesInventory) {
    return this.put(this.route.concat(id), model);
  }

  removeInventory(id: string | number): Observable<TypesInventory> {
    return this.requestRepository.remove(this.route, id);
  }

  getAllWithFiltersDetails(params: _Params) {
    return this.get(this.routeDetail, params);
  }
  getInventotyDetailsById(id: string | number): Observable<IInventoryQuery> {
    return this.requestRepository.getById(this.routeDetail, id);
  }
  createInventoryDetail(
    model: IInventoryQuery
  ): Observable<IListResponse<IInventoryQuery | TypesInventory>> {
    return this.requestRepository.create(this.routeDetail, model);
  }

  update(
    id: string | number,
    model: IInventoryQuery
  ): Observable<IListResponse<IInventoryQuery | TypesInventory>> {
    return this.requestRepository.update(this.routeDetail, id, model);
  }

  remove(id: string | number): Observable<IInventoryQuery | TypesInventory> {
    return this.requestRepository.remove(this.routeDetail, id);
  }
}
