import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IShelves } from '../../models/catalogs/shelves.model';
@Injectable({
  providedIn: 'root',
})
export class ShelvesService implements ICrudMethods<IShelves> {
  private readonly route: string = ENDPOINT_LINKS.Shelves;
  constructor(private shelvesRepository: Repository<IShelves>) {}

  getAll(params?: ListParams): Observable<IListResponse<IShelves>> {
    return this.shelvesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IShelves> {
    return this.shelvesRepository.getById(this.route, id);
  }

  create(model: IShelves): Observable<IShelves> {
    return this.shelvesRepository.create(this.route, model);
  }

  update(id: string | number, model: IShelves): Observable<Object> {
    return this.shelvesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.shelvesRepository.remove(this.route, id);
  }
}
