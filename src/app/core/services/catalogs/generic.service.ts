import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatGeneticsRepository } from 'src/app/common/repository/repositories/cat-generics-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGeneric } from '../../models/catalogs/generic.model';
@Injectable({
  providedIn: 'root',
})
export class GenericService
  extends HttpService
  implements ICrudMethods<IGeneric>
{
  private readonly route: string = ENDPOINT_LINKS.Generic;
  constructor(
    private genericRepository: Repository<IGeneric>,
    private catGenericRepository: CatGeneticsRepository
  ) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IGeneric>> {
    return this.genericRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGeneric> {
    return this.genericRepository.getById(this.route, id);
  }

  create(model: IGeneric): Observable<IGeneric> {
    return this.genericRepository.create(this.route, model);
  }

  newUpdate(model: IGeneric): Observable<Object> {
    return this.genericRepository.newUpdate(this.route, model);
  }

  remove1(name: string, key: number): Observable<Object> {
    const route = `generics/delete-custom/name/${name}/key/${key}`;
    return this.delete(route);
    // return this.genericRepository.remove(this.route, id);
  }

  getBySearch(params: ListParams): Observable<IListResponse<IGeneric>> {
    return this.catGenericRepository.getGenericBySearch(this.route, params);
  }
  getByFilter(params: ListParams): Observable<IListResponse<IGeneric>> {
    return this.catGenericRepository.getGenericByFilter(this.route, params);
  }
}
