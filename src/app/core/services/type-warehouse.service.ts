import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ITypeWarehouse } from '../models/type-warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class TypeWarehouseService implements ICrudMethods<ITypeWarehouse> {
  private readonly route: string = ENDPOINT_LINKS.TypeWarehouse;
  constructor(private typeWarehouseRepository: Repository<ITypeWarehouse>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeWarehouse>> {
    return this.typeWarehouseRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeWarehouse> {
    return this.typeWarehouseRepository.getById(this.route, id);
  }

  create(model: ITypeWarehouse): Observable<ITypeWarehouse> {
    return this.typeWarehouseRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeWarehouse): Observable<Object> {
    return this.typeWarehouseRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeWarehouseRepository.remove(this.route, id);
  }
}
