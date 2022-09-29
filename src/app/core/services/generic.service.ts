import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IGeneric } from '../models/generic.model';
@Injectable({
  providedIn: 'root',
})
export class GenericService implements ICrudMethods<IGeneric> {
  private readonly route: string = ENDPOINT_LINKS.Generic;
  constructor(private genericRepository: Repository<IGeneric>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGeneric>> {
    return this.genericRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGeneric> {
    return this.genericRepository.getById(this.route, id);
  }

  create(model: IGeneric): Observable<IGeneric> {
    return this.genericRepository.create(this.route, model);
  }

  update(id: string | number, model: IGeneric): Observable<Object> {
    return this.genericRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.genericRepository.remove(this.route, id);
  }
}
