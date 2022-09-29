import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IWarehouse } from '../models/warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class WarehouseService implements ICrudMethods<IWarehouse> {
  private readonly route: string = ENDPOINT_LINKS.Warehouse;
  constructor(private warehouseRepository: Repository<IWarehouse>) {}

  getAll(params?: ListParams): Observable<IListResponse<IWarehouse>> {
    return this.warehouseRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IWarehouse> {
    return this.warehouseRepository.getById(this.route, id);
  }

  create(model: IWarehouse): Observable<IWarehouse> {
    return this.warehouseRepository.create(this.route, model);
  }

  update(id: string | number, model: IWarehouse): Observable<Object> {
    return this.warehouseRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.warehouseRepository.remove(this.route, id);
  }
}
