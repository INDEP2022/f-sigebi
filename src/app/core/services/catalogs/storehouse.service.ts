import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStorehouse } from '../../models/catalogs/storehouse.model';
@Injectable({
  providedIn: 'root',
})
export class StorehouseService implements ICrudMethods<IStorehouse> {
  private readonly route: string = ENDPOINT_LINKS.Storehouse;
  constructor(private storehouseRepository: Repository<IStorehouse>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStorehouse>> {
    return this.storehouseRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStorehouse> {
    return this.storehouseRepository.getById(this.route, id);
  }

  create(model: IStorehouse): Observable<IStorehouse> {
    return this.storehouseRepository.create(this.route, model);
  }

  update(id: string | number, model: IStorehouse): Observable<Object> {
    return this.storehouseRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.storehouseRepository.remove(this.route, id);
  }
}
