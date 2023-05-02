import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatGeneticsRepository } from 'src/app/common/repository/repositories/cat-generics-repository';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGeneric } from '../../models/catalogs/generic.model';
@Injectable({
  providedIn: 'root',
})
export class GenericService implements ICrudMethods<IGeneric> {
  private readonly route: string = ENDPOINT_LINKS.Generic;
  constructor(
    private genericRepository: Repository<IGeneric>,
    private catGenericRepository: CatGeneticsRepository
  ) {}

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

  getBySearch(params: ListParams): Observable<IListResponse<IGeneric>> {
    return this.catGenericRepository.getGenericBySearch(this.route, params);
  }
  getByFilter(params: ListParams): Observable<IListResponse<IGeneric>> {
    return this.catGenericRepository.getGenericByFilter(this.route, params);
  }
}
