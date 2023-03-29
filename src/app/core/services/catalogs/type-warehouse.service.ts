import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ITypeWarehouse,
  IWarehouseTypeWarehouse,
} from '../../models/catalogs/type-warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class TypeWarehouseService implements ICrudMethods<ITypeWarehouse> {
  private readonly route: string = ENDPOINT_LINKS.TypeWarehouse;
  private readonly route1: string = ENDPOINT_LINKS.WarehouseTypeWarehouse;

  constructor(
    private typeWarehouseRepository: Repository<ITypeWarehouse>,
    private wareHouseType: Repository<IWarehouseTypeWarehouse>
  ) {}

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

  getAllType(
    params?: ListParams
  ): Observable<IListResponse<IWarehouseTypeWarehouse>> {
    return this.wareHouseType.getAllPaginated(this.route1, params);
  }

  getByIdType(id: string | number): Observable<IWarehouseTypeWarehouse> {
    return this.wareHouseType.getById(this.route1, id);
  }

  createType(model: ITypeWarehouse): Observable<IWarehouseTypeWarehouse> {
    return this.wareHouseType.create(this.route1, model);
  }

  updateType(
    id: string | number,
    model: IWarehouseTypeWarehouse
  ): Observable<Object> {
    return this.wareHouseType.update(this.route1, id, model);
  }

  removeType(id: string | number): Observable<Object> {
    return this.wareHouseType.remove(this.route1, id);
  }
}
