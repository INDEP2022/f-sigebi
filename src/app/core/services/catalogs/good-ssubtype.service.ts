import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodSsubType } from '../../models/catalogs/good-ssubtype.model';
@Injectable({
  providedIn: 'root',
})
export class GoodSsubtypeService
  extends HttpService
  implements ICrudMethods<IGoodSsubType>
{
  private readonly route: string = ENDPOINT_LINKS.GoodSsubtype;
  constructor(private goodSsubtypeRepository: Repository<IGoodSsubType>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodSsubType>> {
    return this.goodSsubtypeRepository.getAllPaginated(this.route, params);
  }

  getAll1(params?: ListParams): Observable<IListResponse<IGoodSsubType>> {
    return this.goodSsubtypeRepository.getAll(this.route, params);
  }

  // getById(id: string | number): Observable<IGoodSsubType> {
  //   return this.goodSsubtypeRepository.getById(this.route, id);
  // }
  getByIds(ids: Partial<IGoodSsubType>): Observable<IGoodSsubType> {
    return this.goodSsubtypeRepository.getByIds(this.route, ids);
  }

  create(model: IGoodSsubType): Observable<IGoodSsubType> {
    return this.goodSsubtypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodSsubType): Observable<Object> {
    return this.goodSsubtypeRepository.update(this.route, id, model);
  }
  updateByIds(
    ids: Partial<IGoodSsubType>,
    model: IGoodSsubType
  ): Observable<Object> {
    return this.goodSsubtypeRepository.updateByIds(this.route, ids, model);
  }
  remove(id: string | number): Observable<Object> {
    console.log('que elimina', this.route, id);
    return this.goodSsubtypeRepository.remove(this.route, id);
  }

  removeByIds(ids: Partial<IGoodSsubType>): Observable<Object> {
    return this.goodSsubtypeRepository.removeByIds(this.route, ids);
  }

  getByManyIds(body: any, params?: ListParams) {
    const route = 'good-ssubtype/search-by-type';
    return this.post<IListResponse<IGoodSsubType>>(route, body, params);
  }

  getAllFilter(params: _Params) {
    return this.get('good-ssubtype', params);
  }
}
