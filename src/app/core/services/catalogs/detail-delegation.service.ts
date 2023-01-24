import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDetailDelegation } from '../../models/catalogs/detail-delegation.model';
@Injectable({
  providedIn: 'root',
})
export class DetailDelegationService
  implements ICrudMethods<IDetailDelegation>
{
  private readonly route: string = ENDPOINT_LINKS.DetailDelegation;
  private readonly route2: string = 'catalog/detail-delegation/search';
  constructor(
    private detailDelegationRepository: Repository<IDetailDelegation>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDetailDelegation>> {
    return this.detailDelegationRepository.getAllPaginated(this.route2, params);
  }

  getById(id: string | number): Observable<IDetailDelegation> {
    return this.detailDelegationRepository.getById(this.route, id);
  }

  create(model: IDetailDelegation): Observable<IDetailDelegation> {
    return this.detailDelegationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDetailDelegation): Observable<Object> {
    return this.detailDelegationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.detailDelegationRepository.remove(this.route, id);
  }
}
