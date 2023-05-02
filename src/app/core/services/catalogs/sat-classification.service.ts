import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISatClassification } from '../../models/catalogs/sat-classification.model';
@Injectable({
  providedIn: 'root',
})
export class SatClassificationService
  implements ICrudMethods<ISatClassification>
{
  private readonly route: string = ENDPOINT_LINKS.SATClasification;
  constructor(
    private satClasificationRepository: Repository<ISatClassification>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ISatClassification>> {
    return this.satClasificationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISatClassification> {
    return this.satClasificationRepository.getById(this.route, id);
  }

  create(model: ISatClassification): Observable<ISatClassification> {
    return this.satClasificationRepository.create(this.route, model);
  }

  update(id: string | number, model: ISatClassification): Observable<Object> {
    return this.satClasificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.satClasificationRepository.remove(this.route, id);
  }
}
