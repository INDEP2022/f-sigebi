import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IClaimConclusion } from '../../models/catalogs/claim-conclusion.model';
@Injectable({
  providedIn: 'root',
})
export class ClaimConclusionService implements ICrudMethods<IClaimConclusion> {
  private readonly route: string = ENDPOINT_LINKS.ClaimConclusion;
  constructor(
    private claimConclusionRepository: Repository<IClaimConclusion>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IClaimConclusion>> {
    return this.claimConclusionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IClaimConclusion> {
    return this.claimConclusionRepository.getById(this.route, id);
  }

  create(model: IClaimConclusion): Observable<IClaimConclusion> {
    return this.claimConclusionRepository.create(this.route, model);
  }

  update(id: string | number, model: IClaimConclusion): Observable<Object> {
    return this.claimConclusionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.claimConclusionRepository.remove(this.route, id);
  }
}
