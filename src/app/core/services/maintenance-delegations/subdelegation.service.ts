import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceDelegationEndpoints } from 'src/app/common/constants/endpoints/maintenance-delegation-endpoint';
import { SubDelegationRepository } from 'src/app/common/repository/repositories/subdelegation-repository';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISubdelegation } from '../../models/catalogs/subdelegation.model';
@Injectable({
  providedIn: 'root',
})
export class SubDelegationService {
  private readonly route = MaintenanceDelegationEndpoints;
  constructor(
    private subDelegationRepository: SubDelegationRepository<ISubdelegation>
  ) {}

  getById(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ISubdelegation>> {
    return this.subDelegationRepository.getById(
      `catalog/api/v1/${this.route.SubDelegation}`,
      id
    );
  }

  create(model: ISubdelegation): Observable<ISubdelegation> {
    return this.subDelegationRepository.create(this.route.SubDelegation, model);
  }

  update(id: string | number, model: ISubdelegation): Observable<Object> {
    return this.subDelegationRepository.update(
      this.route.SubDelegation,
      id,
      model
    );
  }

  //   getById(id: string | number): Observable<IDelegation> {
  //     return this.delegationRepository.getById(this.route, id);
  //   }

  //   create(model: IDelegation): Observable<IDelegation> {
  //     return this.delegationRepository.create(this.route, model);
  //   }

  //   update(id: string | number, model: IDelegation): Observable<Object> {
  //     return this.delegationRepository.update(this.route, id, model);
  //   }

  //   remove(id: string | number): Observable<Object> {
  //     return this.delegationRepository.remove(this.route, id);
  //   }
}
