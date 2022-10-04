import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDepartament } from '../../models/catalogs/departament.model';
@Injectable({
  providedIn: 'root',
})
export class DepartamentService implements ICrudMethods<IDepartament> {
  private readonly route: string = ENDPOINT_LINKS.Departament;
  constructor(private departamentRepository: Repository<IDepartament>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDepartament>> {
    return this.departamentRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDepartament> {
    return this.departamentRepository.getById(this.route, id);
  }

  create(model: IDepartament): Observable<IDepartament> {
    return this.departamentRepository.create(this.route, model);
  }

  update(id: string | number, model: IDepartament): Observable<Object> {
    return this.departamentRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.departamentRepository.remove(this.route, id);
  }
}
