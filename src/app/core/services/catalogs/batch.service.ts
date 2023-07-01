import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBatch } from '../../models/catalogs/batch.model';
import { IWarehouse } from '../../models/catalogs/warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class BatchService implements ICrudMethods<IBatch> {
  private readonly route: string = ENDPOINT_LINKS.Batch;
  private readonly warehouseRoute: string = ENDPOINT_LINKS.Warehouse;
  constructor(
    private batchRepository: Repository<IBatch>,
    private warehouseRepository: Repository<IWarehouse>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IBatch>> {
    return this.batchRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IBatch> {
    return this.batchRepository.getById(this.route, id);
  }

  create(model: IBatch): Observable<IBatch> {
    return this.batchRepository.create(this.route, model);
  }

  update(id: string | number, model: IBatch): Observable<Object> {
    return this.batchRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.batchRepository.remove(`${this.route}/id/`, id);
  }

  getAlmacen(params?: ListParams): Observable<IListResponse<IWarehouse>> {
    return this.warehouseRepository.getAllPaginated(
      this.warehouseRoute,
      params
    );
  }
}
