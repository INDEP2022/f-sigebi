import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IClaimStatus } from '../models/claims-status.model';
@Injectable({
  providedIn: 'root',
})
export class ClaimStatusService implements ICrudMethods<IClaimStatus> {
  private readonly route: string = ENDPOINT_LINKS.ClaimStatus;
  constructor(private claimConclusionRepository: Repository<IClaimStatus>) {}

  getAll(params?: ListParams): Observable<IListResponse<IClaimStatus>> {
    return this.claimConclusionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IClaimStatus> {
    return this.claimConclusionRepository.getById(this.route, id);
  }

  create(model: IClaimStatus): Observable<IClaimStatus> {
    return this.claimConclusionRepository.create(this.route, model);
  }

  update(id: string | number, model: IClaimStatus): Observable<Object> {
    return this.claimConclusionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.claimConclusionRepository.remove(this.route, id);
  }
}
