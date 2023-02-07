import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodSubType } from '../../models/catalogs/good-subtype.model';
import { IGoodType } from '../../models/catalogs/good-type.model';
@Injectable({
  providedIn: 'root',
})
export class GoodSubtypeService implements ICrudMethods<IGoodSubType> {
  private readonly route: string = ENDPOINT_LINKS.GoodSubtype;
  private readonly typesRoute: string = ENDPOINT_LINKS.GoodType;
  constructor(
    private goodSubtypeRepository: Repository<IGoodSubType>,
    private goodTypeService: Repository<IGoodType>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodSubType>> {
    return this.goodSubtypeRepository.getAllPaginated(this.route, params);
  }

  getByIds(ids: Partial<IGoodSubType>): Observable<IGoodSubType> {
    return this.goodSubtypeRepository.getByIds(this.route, ids);
  }
  // getByIds(ids: string | number): Observable<IGoodSubType> {
  //   return this.goodSubtypeRepository
  //     .getById(this.route, id)
  //     .pipe(map((response: any) => convertArrayResponse(response)));
  // }

  create(model: IGoodSubType): Observable<IGoodSubType> {
    return this.goodSubtypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodSubType): Observable<Object> {
    return this.goodSubtypeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodSubtypeRepository.remove(this.route, id);
  }

  getTypes(params: ListParams) {
    return this.goodTypeService.getAllPaginated(this.typesRoute, params);
  }
}
