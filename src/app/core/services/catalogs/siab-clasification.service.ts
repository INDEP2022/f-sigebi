import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISiabClasification } from '../../models/catalogs/siab-clasification.model';
@Injectable({
  providedIn: 'root',
})
export class SIABClasificationService
  implements ICrudMethods<ISiabClasification>
{
  private readonly route: string = ENDPOINT_LINKS.SIABClasification;
  constructor(
    private siabClasificationRepository: Repository<ISiabClasification>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ISiabClasification>> {
    return this.siabClasificationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISiabClasification> {
    return this.siabClasificationRepository.getById(this.route, id);
  }

  create(model: ISiabClasification): Observable<ISiabClasification> {
    return this.siabClasificationRepository.create(this.route, model);
  }

  update(id: string | number, model: ISiabClasification): Observable<Object> {
    return this.siabClasificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.siabClasificationRepository.remove(this.route, id);
  }
}
