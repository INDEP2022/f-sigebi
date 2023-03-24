import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _Params } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICourt } from '../../models/catalogs/court.model';
@Injectable({
  providedIn: 'root',
})
export class CourtService extends HttpService implements ICrudMethods<ICourt> {
  private readonly route: string = ENDPOINT_LINKS.Court;
  constructor(private courtRepository: Repository<ICourt>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<ICourt>> {
    return this.courtRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICourt> {
    const segments = this.route.split('/');
    const route = `${segments[1]}/id/${id}`;
    return this.get(route);
    // return this.courtRepository.getById(this.route, id);
  }

  create(model: ICourt): Observable<ICourt> {
    return this.courtRepository.create(this.route, model);
  }

  update(id: string | number, model: ICourt): Observable<Object> {
    return this.courtRepository.update(this.route, id, model);
  }

  updateCourt(model: ICourt) {
    return this.put(`court`, model);
  }

  remove(id: string | number): Observable<Object> {
    const route2 = `${this.route}/id/`;
    return this.courtRepository.remove(route2, id);
  }

  getAllFiltered(params?: _Params): Observable<IListResponse<ICourt>> {
    const segments = this.route.split('/');
    return this.get<IListResponse<ICourt>>(segments[1], params);
  }
}
