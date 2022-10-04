import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISatSaeClassification } from '../../models/catalogs/satsae-classification.model';
@Injectable({
  providedIn: 'root',
})
export class SATSAEClasificationService
  implements ICrudMethods<ISatSaeClassification>
{
  private readonly route: string = ENDPOINT_LINKS.SATSAEClasification;
  constructor(
    private satSaeSubclasificationRepository: Repository<ISatSaeClassification>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<ISatSaeClassification>> {
    return this.satSaeSubclasificationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<ISatSaeClassification> {
    return this.satSaeSubclasificationRepository.getById(this.route, id);
  }

  create(model: ISatSaeClassification): Observable<ISatSaeClassification> {
    return this.satSaeSubclasificationRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: ISatSaeClassification
  ): Observable<Object> {
    return this.satSaeSubclasificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.satSaeSubclasificationRepository.remove(this.route, id);
  }
}
