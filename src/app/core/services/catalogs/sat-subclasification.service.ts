import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISatSubclasification } from '../../models/catalogs/sat-subclasification.model';
@Injectable({
  providedIn: 'root',
})
export class SATSubclasificationService
  implements ICrudMethods<ISatSubclasification>
{
  private readonly route: string = ENDPOINT_LINKS.SATSubclasification;
  constructor(
    private satSubclasificationRepository: Repository<ISatSubclasification>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ISatSubclasification>> {
    return this.satSubclasificationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<ISatSubclasification> {
    return this.satSubclasificationRepository.getById(this.route, id);
  }

  create(model: ISatSubclasification): Observable<ISatSubclasification> {
    return this.satSubclasificationRepository.create(this.route, model);
  }

  update(id: string | number, model: ISatSubclasification): Observable<Object> {
    return this.satSubclasificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.satSubclasificationRepository.remove(this.route, id);
  }
}
