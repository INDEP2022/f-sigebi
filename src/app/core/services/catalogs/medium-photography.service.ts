import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMediumPhotography } from '../../models/catalogs/medium-photography.model';
@Injectable({
  providedIn: 'root',
})
export class MediumPhotographyService
  implements ICrudMethods<IMediumPhotography>
{
  private readonly route: string = ENDPOINT_LINKS.MediumPhotography;
  constructor(
    private mediumPhotographyRepository: Repository<IMediumPhotography>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IMediumPhotography>> {
    return this.mediumPhotographyRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMediumPhotography> {
    return this.mediumPhotographyRepository.getById(this.route, id);
  }

  create(model: IMediumPhotography): Observable<IMediumPhotography> {
    return this.mediumPhotographyRepository.create(this.route, model);
  }

  update(id: string | number, model: IMediumPhotography): Observable<Object> {
    return this.mediumPhotographyRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.mediumPhotographyRepository.remove(this.route, id);
  }
}
