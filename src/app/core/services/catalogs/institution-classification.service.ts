import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IInstitutionClassification } from '../../models/catalogs/institution-classification.model';
@Injectable({
  providedIn: 'root',
})
export class InstitutionClasificationService
  implements ICrudMethods<IInstitutionClassification>
{
  private readonly route: string = ENDPOINT_LINKS.InstitutionClasification;
  constructor(
    private institutionClasificationRepository: Repository<IInstitutionClassification>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IInstitutionClassification>> {
    return this.institutionClasificationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IInstitutionClassification> {
    return this.institutionClasificationRepository.getById(this.route, id);
  }

  create(
    model: IInstitutionClassification
  ): Observable<IInstitutionClassification> {
    return this.institutionClasificationRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: IInstitutionClassification
  ): Observable<Object> {
    return this.institutionClasificationRepository.update(
      this.route,
      id,
      model
    );
  }

  newUpdate(model: IInstitutionClassification): Observable<Object> {
    return this.institutionClasificationRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.institutionClasificationRepository.remove(this.route, id);
  }
}
