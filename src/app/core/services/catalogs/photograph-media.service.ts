import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPhotographMedia } from '../../models/catalogs/photograph-media.model';
@Injectable({
  providedIn: 'root',
})
export class PhotographMediaService implements ICrudMethods<IPhotographMedia> {
  private readonly route: string = ENDPOINT_LINKS.MediumPhotography;
  constructor(
    private mediumPhotographyRepository: Repository<IPhotographMedia>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IPhotographMedia>> {
    return this.mediumPhotographyRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IPhotographMedia> {
    return this.mediumPhotographyRepository.getById(this.route, id);
  }

  create(model: IPhotographMedia): Observable<IPhotographMedia> {
    return this.mediumPhotographyRepository.create(this.route, model);
  }

  update(id: string | number, model: IPhotographMedia): Observable<Object> {
    return this.mediumPhotographyRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.mediumPhotographyRepository.remove(this.route, id);
  }
}
