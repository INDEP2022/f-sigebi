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

  getCrime(params?: ListParams) {
    const route1 = 'catalog/apps/getOtPass';
    return this.affairRepository.getAllPaginated(route1, params);
  }

  getObtnGood(params?: ListParams) {
    const route1 = 'apps/obtn-good-pag';
    return this.get(route1, params);
  }

  getCveTransfer(body: any, params?: ListParams) {
    const route1 = 'catalog/apps/getTransferKey';
    return this.affairRepository.create3(route1, body, params);
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
    const route = `affair/id/${id}/nbOrigen/${model.nbOrigen}`;
    return this.put(route, model);
  }

  remove2(id: number, nb: string) {
    const route = `affair/id/${id}/nbOrigen/${nb}`;
    return this.delete(route);
  }
}
