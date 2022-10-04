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

  getById(id: string | number): Observable<IOrigin> {
    return this.originRepository.getById(this.route, id);
  }

  create(model: IOrigin): Observable<IOrigin> {
    return this.originRepository.create(this.route, model);
  }

  update(id: string | number, model: IOrigin): Observable<Object> {
    return this.originRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.originRepository.remove(this.route, id);
  }
}
