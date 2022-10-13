import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusClaims } from '../../models/catalogs/status-claims.model';

@Injectable({
  providedIn: 'root',
})
export class StatusClaimsService implements ICrudMethods<IStatusClaims> {
  private readonly route: string = ENDPOINT_LINKS.ClaimStatus;
  constructor(private claimConclusionRepository: Repository<IStatusClaims>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStatusClaims>> {
    return this.claimConclusionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusClaims> {
    return this.claimConclusionRepository.getById(this.route, id);
  }

  create(model: IStatusClaims): Observable<IStatusClaims> {
    return this.claimConclusionRepository.create(this.route, model);
  }

  update(id: string | number, model: IStatusClaims): Observable<Object> {
    return this.claimConclusionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.claimConclusionRepository.remove(this.route, id);
  }
}
