import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IEntfed } from '../../models/catalogs/entfed.model';
@Injectable({
  providedIn: 'root',
})
export class EntFedService implements ICrudMethods<IEntfed> {
  private readonly route: string = ENDPOINT_LINKS.EntFed;
  constructor(private entFedRepository: Repository<IEntfed>) {}

  getAll(params?: ListParams): Observable<IListResponse<IEntfed>> {
    return this.entFedRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IEntfed> {
    return this.entFedRepository.getById(this.route, id);
  }

  create(model: IEntfed): Observable<IEntfed> {
    return this.entFedRepository.create(this.route, model);
  }

  update(id: string | number, model: IEntfed): Observable<Object> {
    return this.entFedRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.entFedRepository.remove(this.route, id);
  }
}
