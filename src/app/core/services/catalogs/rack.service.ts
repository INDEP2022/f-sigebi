import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRack } from '../../models/catalogs/rack.model';
import { IWarehouse } from '../../models/catalogs/warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class RackService implements ICrudMethods<IRack> {
  private readonly route: string = ENDPOINT_LINKS.Rack;
  private readonly warehouseRoute: string = ENDPOINT_LINKS.Warehouse;
  constructor(
    private rackRepository: Repository<IRack>,
    private warehouseRepository: Repository<IWarehouse>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IRack>> {
    return this.rackRepository.getAllPaginated(this.route, params);
  }
  getAllFilter(params?: ListParams): Observable<IListResponse<IRack>> {
    return this.rackRepository.getAllPaginated(this.route + '/get-all', params);
  }

  getById(id: string | number): Observable<IRack> {
    return this.rackRepository.getById(this.route, id);
  }

  create(model: IRack): Observable<IRack> {
    return this.rackRepository.create(this.route, model);
  }

  /*update(id: string | number, model: IRack): Observable<Object> {
    return this.rackRepository.update(this.route, id, model);
  }*/

  update8(
    id: string | number,
    idWarehouse: string | number,
    idBatch: string | number,
    modal: IRack
  ): Observable<Object> {
    return this.rackRepository.update8(
      this.route,
      id,
      idWarehouse,
      idBatch,
      modal
    );
  }

  remove(id: string | number): Observable<Object> {
    return this.rackRepository.remove(this.route, id);
  }

  getWarehouse(params?: ListParams): Observable<Object> {
    return this.warehouseRepository.getAllPaginated(
      this.warehouseRoute,
      params
    );
  }
}
