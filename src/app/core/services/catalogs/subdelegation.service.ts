import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISubdelegation } from '../../models/catalogs/subdelegation.model';
@Injectable({
  providedIn: 'root',
})
export class SubdelegationService implements ICrudMethods<ISubdelegation> {
  private readonly route: string = ENDPOINT_LINKS.Subdelegation;
  constructor(private subdelegationRepository: Repository<ISubdelegation>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISubdelegation>> {
    return this.subdelegationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISubdelegation> {
    return this.subdelegationRepository.getById(this.route, id);
  }

  create(model: ISubdelegation): Observable<ISubdelegation> {
    return this.subdelegationRepository.create(this.route, model);
  }

  update(id: string | number, model: ISubdelegation): Observable<Object> {
    return this.subdelegationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.subdelegationRepository.remove(this.route, id);
  }
}
