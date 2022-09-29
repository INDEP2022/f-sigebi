import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIssuingInstitution } from '../../models/catalogs/issuing-institution.model';
@Injectable({
  providedIn: 'root',
})
export class IssuingInstitutionService
  implements ICrudMethods<IIssuingInstitution>
{
  private readonly route: string = ENDPOINT_LINKS.IssuingInstitution;
  constructor(
    private issuingInstitutionRepository: Repository<IIssuingInstitution>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IIssuingInstitution>> {
    return this.issuingInstitutionRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IIssuingInstitution> {
    return this.issuingInstitutionRepository.getById(this.route, id);
  }

  create(model: IIssuingInstitution): Observable<IIssuingInstitution> {
    return this.issuingInstitutionRepository.create(this.route, model);
  }

  update(id: string | number, model: IIssuingInstitution): Observable<Object> {
    return this.issuingInstitutionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.issuingInstitutionRepository.remove(this.route, id);
  }
}
