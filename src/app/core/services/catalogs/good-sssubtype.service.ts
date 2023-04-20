import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodSssubtype } from '../../models/catalogs/good-sssubtype.model';
@Injectable({
  providedIn: 'root',
})
export class GoodSssubtypeService
  extends HttpService
  implements ICrudMethods<IGoodSssubtype>
{
  private readonly route: string = ENDPOINT_LINKS.GoodSssubtype;
  constructor(private goodSssubtypeRepository: Repository<IGoodSssubtype>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodSssubtype>> {
    return this.goodSssubtypeRepository.getAllPaginated(this.route, params);
  }

  getFilter(params?: string): Observable<IListResponse<IGoodSssubtype>> {
    return this.goodSssubtypeRepository.getAllPaginated(this.route, params);
  }

  getAll2(params: string) {
    return this.get<IListResponse<IGoodSssubtype>>('good-sssubtype', params);
  }

  getById(id: string | number): Observable<IGoodSssubtype> {
    return this.goodSssubtypeRepository.getById(this.route, id);
  }

  getByIds(ids: Partial<IGoodSssubtype>): Observable<IGoodSssubtype> {
    return this.goodSssubtypeRepository.getByIds(this.route, ids);
  }
  create(model: IGoodSssubtype): Observable<IGoodSssubtype> {
    return this.goodSssubtypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodSssubtype): Observable<Object> {
    return this.goodSssubtypeRepository.update(this.route, id, model);
  }
  updateByIds(
    ids: Partial<IGoodSssubtype>,
    model: IGoodSssubtype
  ): Observable<Object> {
    return this.goodSssubtypeRepository.updateByIds(this.route, ids, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodSssubtypeRepository.remove(this.route, id);
  }

  getByManyIds(body: any, params?: ListParams) {
    console.log(body);
    const route = 'good-sssubtype/search-by-type';
    return this.post<IListResponse<IGoodSssubtype>>(route, body, params);
  }

  getClasification(
    id: string | number
  ): Observable<IListResponse<IGoodSssubtype>> {
    return this.goodSssubtypeRepository.getClassif(id);
  }
}
