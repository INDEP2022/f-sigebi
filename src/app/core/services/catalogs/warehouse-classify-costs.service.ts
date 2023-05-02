import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IClassifyCosts,
  IWarehouseClassifyCosts,
} from '../../models/catalogs/warehouse-classify-costs';

@Injectable({
  providedIn: 'root',
})
export class WarehouseClassifyCostsService
  implements ICrudMethods<IWarehouseClassifyCosts>
{
  private readonly route: string = ENDPOINT_LINKS.WarehouseClassifyCosts;
  constructor(
    private warehouseRepository: Repository<IWarehouseClassifyCosts>,
    private warehouseCostRepository: Repository<IClassifyCosts>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IWarehouseClassifyCosts>> {
    return this.warehouseRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IWarehouseClassifyCosts> {
    return this.warehouseRepository.getById(this.route, id);
  }

  create1(model: IClassifyCosts): Observable<IClassifyCosts> {
    return this.warehouseCostRepository.create(this.route, model);
  }

  update7(model: IClassifyCosts): Observable<Object> {
    return this.warehouseCostRepository.update7(this.route, model);
  }

  remove3(model: IWarehouseClassifyCosts): Observable<Object> {
    return this.warehouseRepository.remove3(this.route, model);
  }
}
