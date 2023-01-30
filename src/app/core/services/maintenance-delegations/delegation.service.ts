import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceDelegationEndpoints } from 'src/app/common/constants/endpoints/maintenance-delegation-endpoint';
import { DelegationRepository } from 'src/app/common/repository/repositories/delegation-repository';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDelegation } from '../../models/catalogs/delegation.model';
@Injectable({
  providedIn: 'root',
})
export class DelegationService {
  private readonly route = MaintenanceDelegationEndpoints;
  constructor(
    private delegationRepository: DelegationRepository<IDelegation>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository.getAllPaginated(
      this.route.Delegation,
      params
    );
  }

  getDelegations(params: ListParams) {
    return this.delegationRepository.getAllPaginated(
      this.route.Delegation,
      params
    );
  }
}
