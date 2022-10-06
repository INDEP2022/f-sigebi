import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IImageMedia } from '../../models/catalogs/image-media.model';
@Injectable({
  providedIn: 'root',
})
export class ImageMediaService implements ICrudMethods<IImageMedia> {
  private readonly route: string = ENDPOINT_LINKS.HalfImage;
  constructor(private halfImageRepository: Repository<IImageMedia>) {}

  getAll(params?: ListParams): Observable<IListResponse<IImageMedia>> {
    return this.halfImageRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IImageMedia> {
    return this.halfImageRepository.getById(this.route, id);
  }

  create(model: IImageMedia): Observable<IImageMedia> {
    return this.halfImageRepository.create(this.route, model);
  }

  update(id: string | number, model: IImageMedia): Observable<Object> {
    return this.halfImageRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.halfImageRepository.remove(this.route, id);
  }
}
