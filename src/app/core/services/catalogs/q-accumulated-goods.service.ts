import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IQAccumulatedGoods } from '../../models/catalogs/q-accumulated-goods.model';
@Injectable({
  providedIn: 'root',
})
export class QAccumulatedGoodsService
  implements ICrudMethods<IQAccumulatedGoods>
{
  private readonly route: string = ENDPOINT_LINKS.QAccumulatedGoods;
  constructor(
    private qAccumulatedGoodsRepository: Repository<IQAccumulatedGoods>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IQAccumulatedGoods>> {
    return this.qAccumulatedGoodsRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IQAccumulatedGoods> {
    return this.qAccumulatedGoodsRepository.getById(this.route, id);
  }

  create(model: IQAccumulatedGoods): Observable<IQAccumulatedGoods> {
    return this.qAccumulatedGoodsRepository.create(this.route, model);
  }

  update(id: string | number, model: IQAccumulatedGoods): Observable<Object> {
    return this.qAccumulatedGoodsRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.qAccumulatedGoodsRepository.remove(this.route, id);
  }
}
