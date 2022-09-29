import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocCompensation } from '../../models/catalogs/doc-compensation.model';
@Injectable({
  providedIn: 'root',
})
export class DocCompensationService implements ICrudMethods<IDocCompensation> {
  private readonly route: string = ENDPOINT_LINKS.DocCompensation;
  constructor(
    private docCompensationRepository: Repository<IDocCompensation>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocCompensation>> {
    return this.docCompensationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDocCompensation> {
    return this.docCompensationRepository.getById(this.route, id);
  }

  create(model: IDocCompensation): Observable<IDocCompensation> {
    return this.docCompensationRepository.create(this.route, model);
  }

  update(id: string | number, model: IDocCompensation): Observable<Object> {
    return this.docCompensationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.docCompensationRepository.remove(this.route, id);
  }
}
