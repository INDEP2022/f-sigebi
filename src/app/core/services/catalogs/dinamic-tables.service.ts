import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITables } from '../../models/catalogs/dinamic-tables.model';
@Injectable({
  providedIn: 'root',
})
export class DinamicTablesService implements ICrudMethods<ITables> {
  private readonly route: string = ENDPOINT_LINKS.DinamicTables;

  constructor(private dinamicTablesRepository: Repository<ITables>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITables>> {
    return this.dinamicTablesRepository.getAllPaginated(this.route, params);
  }
  getById(id: string | number): Observable<ITables> {
    return this.dinamicTablesRepository.getById(this.route, id);
  }

  create(model: ITables): Observable<ITables> {
    return this.dinamicTablesRepository.create(this.route, model);
  }

  update(id: string | number, model: ITables): Observable<Object> {
    return this.dinamicTablesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.dinamicTablesRepository.remove(this.route, id);
  }
}
