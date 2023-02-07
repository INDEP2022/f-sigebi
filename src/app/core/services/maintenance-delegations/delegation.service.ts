import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { Repository } from 'src/app/common/repository/repository';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDelegation } from '../../models/catalogs/delegation.model';
@Injectable({
  providedIn: 'root',
})
export class DelegationService {
  private readonly route: string = ENDPOINT_LINKS.Delegation;
  constructor(private delegationRepository2: Repository<IDelegation>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDelegation>> {
    return this.delegationRepository2.getAllPaginated(this.route, params);
  }
}
