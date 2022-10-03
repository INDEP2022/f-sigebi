import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsSubtype } from '../../models/catalogs/goods-subtype.model';
@Injectable({
  providedIn: 'root',
})
export class GoodsSubtypeService implements ICrudMethods<IGoodsSubtype> {
  private readonly route: string = ENDPOINT_LINKS.GoodsSubtype;
  constructor(private goodsSubtypeRepository: Repository<IGoodsSubtype>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodsSubtype>> {
    return this.goodsSubtypeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGoodsSubtype> {
    return this.goodsSubtypeRepository.getById(this.route, id);
  }

  create(model: IGoodsSubtype): Observable<IGoodsSubtype> {
    return this.goodsSubtypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodsSubtype): Observable<Object> {
    return this.goodsSubtypeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodsSubtypeRepository.remove(this.route, id);
  }
}
