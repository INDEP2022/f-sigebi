import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDelegationState } from '../../models/catalogs/delegation-state.model';
@Injectable({
  providedIn: 'root',
})
export class DelegationStateService implements ICrudMethods<IDelegationState> {
  private readonly route: string = ENDPOINT_LINKS.DelegationState;
  constructor(
    private delegationStateRepository: Repository<IDelegationState>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDelegationState>> {
    return this.delegationStateRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDelegationState> {
    return this.delegationStateRepository.getById(this.route, id);
  }

  create(model: IDelegationState): Observable<IDelegationState> {
    return this.delegationStateRepository.create(this.route, model);
  }

  newUpdate(id: string | number): Observable<Object> {
    console.log('cambia', this.route, id);
    return this.delegationStateRepository.newUpdate(this.route, id);
  }

  newRemove(id: string | number): Observable<Object> {
    return this.delegationStateRepository.remove(this.route, id);
  }
}
