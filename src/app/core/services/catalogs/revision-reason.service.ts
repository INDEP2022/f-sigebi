import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRevisionReason } from '../../models/catalogs/revision-reason.model';
@Injectable({
  providedIn: 'root',
})
export class RevisionReasonService implements ICrudMethods<IRevisionReason> {
  private readonly route: string = ENDPOINT_LINKS.RevisionReason;
  constructor(private revisionReasonRepository: Repository<IRevisionReason>) {}

  getAll(params?: ListParams): Observable<IListResponse<IRevisionReason>> {
    return this.revisionReasonRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRevisionReason> {
    return this.revisionReasonRepository.getById(this.route, id);
  }

  create(model: IRevisionReason): Observable<IRevisionReason> {
    return this.revisionReasonRepository.create(this.route, model);
  }

  update(id: string | number, model: IRevisionReason): Observable<Object> {
    return this.revisionReasonRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.revisionReasonRepository.remove(this.route, id);
  }
}
