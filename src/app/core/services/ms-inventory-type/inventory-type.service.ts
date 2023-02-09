import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_INVENTORY } from 'src/app/common/constants/endpoints/ms-inventory-query';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { InventoryQueryRepository } from 'src/app/common/repository/repositories/ms-inventory-query-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IInventoryQuery,
  TypesInventory,
} from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryTypeService
  implements ICrudMethods<IInventoryQuery | TypesInventory>
{
  private readonly route: string = ENDPOINT_INVENTORY.inventory;
  private readonly routeDetail: string = ENDPOINT_INVENTORY.inventoryDetail;

  constructor(
    private requestRepository: InventoryQueryRepository<IInventoryQuery | any>
  ) {}

  getAll(
    params?: ListParams,
    filter?: string
  ): Observable<IListResponse<IInventoryQuery | any>> {
    return this.requestRepository.getAll(this.routeDetail, params, filter);
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

  delete(
    id: string | number
  ): Observable<IListResponse<IInventoryQuery | TypesInventory>> {
    return this.requestRepository.remove(this.routeDetail, id);
  }

  createInventory(
    model: TypesInventory
  ): Observable<IListResponse<IInventoryQuery | TypesInventory>> {
    return this.requestRepository.create(this.route, model);
  }

  getInventotyById(
    id: string | number
  ): Observable<IListResponse<TypesInventory>> {
    return this.requestRepository.getById(this.route, id);
  }
}
