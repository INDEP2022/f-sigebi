import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILegalSupport } from '../../models/catalogs/legal-suport.model';
@Injectable({
  providedIn: 'root',
})
export class LegalSupportService implements ICrudMethods<ILegalSupport> {
  private readonly route: string = ENDPOINT_LINKS.LegalSupport;
  constructor(private legalSupportRepository: Repository<ILegalSupport>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILegalSupport>> {
    return this.legalSupportRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILegalSupport> {
    return this.legalSupportRepository.getById(this.route, id);
  }

  create(model: ILegalSupport): Observable<ILegalSupport> {
    return this.legalSupportRepository.create(this.route, model);
  }

  update(id: string | number, model: ILegalSupport): Observable<Object> {
    return this.legalSupportRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.legalSupportRepository.remove(this.route, id);
  }
}
