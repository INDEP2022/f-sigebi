import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDictamen } from '../../models/catalogs/dictamen.model';
@Injectable({
  providedIn: 'root',
})
export class DictamenService implements ICrudMethods<IDictamen> {
  private readonly route: string = ENDPOINT_LINKS.Dictamen;
  constructor(private dictamenRepository: Repository<IDictamen>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDictamen>> {
    return this.dictamenRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDictamen> {
    return this.dictamenRepository.getById(this.route, id);
  }

  create(model: IDictamen): Observable<IDictamen> {
    return this.dictamenRepository.create(this.route, model);
  }

  update(id: string | number, model: IDictamen): Observable<Object> {
    return this.dictamenRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.dictamenRepository.remove(this.route, id);
  }
}
