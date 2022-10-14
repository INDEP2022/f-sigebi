import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISatSubclassification } from '../../models/catalogs/sat-subclassification.model';
@Injectable({
  providedIn: 'root',
})
export class SATSubclassificationService
  implements ICrudMethods<ISatSubclassification>
{
  private readonly route: string = ENDPOINT_LINKS.SATSubclasification;
  constructor(
    private satSubclasificationRepository: Repository<ISatSubclassification>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<ISatSubclassification>> {
    return this.satSubclasificationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<ISatSubclassification> {
    return this.satSubclasificationRepository.getById(this.route, id);
  }

  create(model: ISatSubclassification): Observable<ISatSubclassification> {
    return this.satSubclasificationRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: ISatSubclassification
  ): Observable<Object> {
    return this.satSubclasificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.satSubclasificationRepository.remove(this.route, id);
  }
}
