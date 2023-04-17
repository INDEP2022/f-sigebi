import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAffair } from '../../models/catalogs/affair.model';
@Injectable({
  providedIn: 'root',
})
export class AffairService
  extends HttpService
  implements ICrudMethods<IAffair>
{
  private readonly route: string = ENDPOINT_LINKS.Affair;
  constructor(private affairRepository: Repository<IAffair>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IAffair>> {
    return this.affairRepository.getAllPaginated(this.route, params);
  }

  /**
   * @deprecated
   **/
  getById(id: string | number): Observable<IAffair> {
    let partials = this.route.split('/');
    const route = `${partials[1]}/id/${id}`;
    return this.get(route);
  }

  getByIdAndOrigin(
    id: string | number,
    origin: 'SIAB' | 'SAMI'
  ): Observable<IAffair> {
    let partials = this.route.split('/');
    const route = `${partials[1]}/id/${id}/nbOrigen/${origin}`;
    return this.get(route);
  }

  create(model: IAffair): Observable<IAffair> {
    return this.affairRepository.create(this.route, model);
  }

  update(id: string | number, model: IAffair): Observable<Object> {
    return this.affairRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.affairRepository.remove(this.route, id);
  }

  getDelegations(params: ListParams) {
    return this.affairRepository.getAllPaginated(this.route, params);
  }

  create2(model: IAffair) {
    const route = `affair`;
    return this.post(route, model);
  }

  update2(id: number, model: IAffair) {
    const route = `affair/id/${id}`;
    return this.put(route, model);
  }

  remove2(id: number) {
    const route = `affair/id/${id}`;
    return this.delete(route);
  }
}
