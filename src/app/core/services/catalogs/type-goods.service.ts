import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeGoods } from '../../models/catalogs/type-goods.model';
@Injectable({
  providedIn: 'root',
})
export class TypeGoodsService implements ICrudMethods<ITypeGoods> {
  private readonly route: string = ENDPOINT_LINKS.TypeGoods;
  constructor(private typeGoodsRepository: Repository<ITypeGoods>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeGoods>> {
    return this.typeGoodsRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeGoods> {
    return this.typeGoodsRepository.getById(this.route, id);
  }

  create(model: ITypeGoods): Observable<ITypeGoods> {
    return this.typeGoodsRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeGoods): Observable<Object> {
    return this.typeGoodsRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeGoodsRepository.remove(this.route, id);
  }
}
