import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IWarehouse } from '../../models/catalogs/warehouse.model';
@Injectable({
  providedIn: 'root',
})
export class WarehouseService
  extends HttpService
  implements ICrudMethods<IWarehouse>
{
  private readonly route: string = ENDPOINT_LINKS.Warehouse;
  private readonly route2: string = 'catalog/warehouse/id';
  constructor(private warehouseRepository: Repository<IWarehouse>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IWarehouse>> {
    return this.warehouseRepository.getAllPaginated(this.route, params);
  }

  search(params?: ListParams): Observable<IListResponse<IWarehouse>> {
    const route = `${this.route}/search`;
    return this.warehouseRepository.getAllPaginated(route, params);
  }

  getById(id: string | number): Observable<IWarehouse> {
    return this.warehouseRepository.getById(`${this.route}/id`, id);
  }

  create(model: any): Observable<IWarehouse> {
    return this.warehouseRepository.create(this.route, model);
  }

  update(id: string | number, model: IWarehouse): Observable<Object> {
    return this.warehouseRepository.update(this.route2, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.warehouseRepository.remove(this.route2, id);
  }

  getAllFilter(params: _Params) {
    return this.get<IListResponse<IWarehouse>>('warehouse', params);
  }

  getAllFilterSelf(self?: WarehouseService, params?: _Params) {
    return self.get<IListResponse<IWarehouse>>('warehouse', params);
  }
}
