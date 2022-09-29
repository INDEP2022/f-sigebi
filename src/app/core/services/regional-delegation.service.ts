import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IRegionalDelegation } from '../models/regional-delegation.model';
@Injectable({
  providedIn: 'root',
})
export class RegionalDelegationService
  implements ICrudMethods<IRegionalDelegation>
{
  private readonly route: string = ENDPOINT_LINKS.RegionalDelegation;
  constructor(
    private regionalDelegationRepository: Repository<IRegionalDelegation>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IRegionalDelegation>> {
    return this.regionalDelegationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IRegionalDelegation> {
    return this.regionalDelegationRepository.getById(this.route, id);
  }

  create(model: IRegionalDelegation): Observable<IRegionalDelegation> {
    return this.regionalDelegationRepository.create(this.route, model);
  }

  update(id: string | number, model: IRegionalDelegation): Observable<Object> {
    return this.regionalDelegationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.regionalDelegationRepository.remove(this.route, id);
  }
}
