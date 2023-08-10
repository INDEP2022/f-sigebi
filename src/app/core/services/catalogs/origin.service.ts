import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IOrigin } from '../../models/catalogs/origin.model';
@Injectable({
  providedIn: 'root',
})
export class OriginService implements ICrudMethods<IOrigin> {
  private readonly route: string = ENDPOINT_LINKS.Origin;
  constructor(private originRepository: Repository<IOrigin>) {}

  getAll(params?: ListParams): Observable<IListResponse<IOrigin>> {
    return this.originRepository.getAllPaginated(this.route, params);
  }
  getAllFilter(params?: ListParams): Observable<IListResponse<IOrigin>> {
    return this.originRepository.getAllPaginated(
      this.route + '/get-all',
      params
    );
  }
  getById(id: string | number): Observable<IOrigin> {
    return this.originRepository.getById(this.route, id);
  }

  create(model: IOrigin): Observable<IOrigin> {
    return this.originRepository.create(this.route, model);
  }

  update1(model: IOrigin): Observable<Object> {
    return this.originRepository.update4(this.route, model);
  }

  newUpdate(model: Object): Observable<Object> {
    return this.originRepository.newUpdate(this.route, model);
  }

  remove(body: any): Observable<Object> {
    return this.originRepository.remove3(this.route, body);
  }
}
