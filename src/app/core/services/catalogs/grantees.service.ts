import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGrantee } from '../../models/catalogs/grantees.model';
@Injectable({
  providedIn: 'root',
})
export class GranteeService implements ICrudMethods<IGrantee> {
  private readonly route: string = ENDPOINT_LINKS.Grantee;
  constructor(private granteeRepository: Repository<IGrantee>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGrantee>> {
    return this.granteeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGrantee> {
    return this.granteeRepository.getById(this.route, id);
  }

  create(model: IGrantee): Observable<IGrantee> {
    return this.granteeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGrantee): Observable<Object> {
    return this.granteeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.granteeRepository.remove(this.route, id);
  }
}
