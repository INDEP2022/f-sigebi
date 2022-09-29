import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IDelegation } from '../models/delegation.model';
@Injectable({
  providedIn: 'root',
})
export class DelegationService implements ICrudMethods<IDelegation> {
  private readonly route: string = ENDPOINT_LINKS.Delegation;
  constructor(private delegationRepository: Repository<IDelegation>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDelegation> {
    return this.delegationRepository.getById(this.route, id);
  }

  create(model: IDelegation): Observable<IDelegation> {
    return this.delegationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDelegation): Observable<Object> {
    return this.delegationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.delegationRepository.remove(this.route, id);
  }
}
