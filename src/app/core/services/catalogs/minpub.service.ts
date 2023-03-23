import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MinPubEndpoints } from 'src/app/common/constants/endpoints/minpub-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMinpub } from '../../models/catalogs/minpub.model';
import { Minpub } from '../../models/parameterization/parametrization.model';
@Injectable({
  providedIn: 'root',
})
export class MinPubService
  extends HttpService
  implements ICrudMethods<IMinpub>
{
  private readonly route: string = ENDPOINT_LINKS.MinPub;
  constructor(private minPubRepository: Repository<IMinpub>) {
    super();
    this.microservice = MinPubEndpoints.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<IMinpub>> {
    return this.minPubRepository.getAllPaginated(this.route, params);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IMinpub>> {
    return this.get('minpub', params);
  }

  getById(id: string | number): Observable<IMinpub> {
    const segments = this.route.split('/');
    const route = `${segments[1]}/id/${id}`;
    return this.get(route);
    // return this.minPubRepository.getById(this.route, id);
  }

  create(model: IMinpub | Minpub): Observable<IMinpub> {
    return this.minPubRepository.create(this.route, model);
  }

  update(id: string | number, model: IMinpub): Observable<Object> {
    return this.minPubRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.minPubRepository.remove(this.route, id);
  }

  update2(model: IMinpub) {
    const route = MinPubEndpoints.MinPub;
    return this.put(route, model);
  }
}
