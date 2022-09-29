import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IHalfImage } from '../models/half-image.model';
@Injectable({
  providedIn: 'root',
})
export class HalfImageService implements ICrudMethods<IHalfImage> {
  private readonly route: string = ENDPOINT_LINKS.HalfImage;
  constructor(private halfImageRepository: Repository<IHalfImage>) {}

  getAll(params?: ListParams): Observable<IListResponse<IHalfImage>> {
    return this.halfImageRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IHalfImage> {
    return this.halfImageRepository.getById(this.route, id);
  }

  create(model: IHalfImage): Observable<IHalfImage> {
    return this.halfImageRepository.create(this.route, model);
  }

  update(id: string | number, model: IHalfImage): Observable<Object> {
    return this.halfImageRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.halfImageRepository.remove(this.route, id);
  }
}
