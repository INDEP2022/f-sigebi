import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { HttpService } from '../../../common/services/http.service';
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

  getById(id: string | number): Observable<IAffair> {
    let partials = this.route.split('/');
    const route = `${partials[1]}/id/${id}`;
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
}
