import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INorm } from '../../models/catalogs/norm.model';
@Injectable({
  providedIn: 'root',
})
export class NormService implements ICrudMethods<INorm> {
  private readonly route: string = ENDPOINT_LINKS.Norm;
  constructor(private normRepository: Repository<INorm>) {}

  getAll(params?: ListParams): Observable<IListResponse<INorm>> {
    return this.normRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<INorm> {
    return this.normRepository.getById(this.route, id);
  }

  create(model: any): Observable<INorm> {
    return this.normRepository.create(this.route, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.normRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.normRepository.remove(this.route, id);
  }
}
