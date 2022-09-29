import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISafe } from '../../models/catalogs/safe.model';
@Injectable({
  providedIn: 'root',
})
export class SafeService implements ICrudMethods<ISafe> {
  private readonly route: string = ENDPOINT_LINKS.Safe;
  constructor(private safeRepository: Repository<ISafe>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISafe>> {
    return this.safeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISafe> {
    return this.safeRepository.getById(this.route, id);
  }

  create(model: ISafe): Observable<ISafe> {
    return this.safeRepository.create(this.route, model);
  }

  update(id: string | number, model: ISafe): Observable<Object> {
    return this.safeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.safeRepository.remove(this.route, id);
  }
}
