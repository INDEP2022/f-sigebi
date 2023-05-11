import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodType } from '../../models/catalogs/good-type.model';
@Injectable({
  providedIn: 'root',
})
export class GoodTypeService implements ICrudMethods<IGoodType> {
  private readonly route: string = ENDPOINT_LINKS.GoodType;
  constructor(private goodTypeRepository: Repository<IGoodType>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodType>> {
    return this.goodTypeRepository.getAllPaginated(this.route, params);
  }
  getAllS(params?: string): Observable<IListResponse<IGoodType>> {
    return this.goodTypeRepository.getAllPaginated(this.route, params);
  }

  search(params?: ListParams) {
    return this.goodTypeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGoodType> {
    return this.goodTypeRepository.getById(`${this.route}/id`, id);
  }

  create(model: IGoodType): Observable<IGoodType> {
    return this.goodTypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodType): Observable<Object> {
    return this.goodTypeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodTypeRepository.remove(this.route, id);
  }
}
