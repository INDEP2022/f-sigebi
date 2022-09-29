import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusCode } from '../../models/catalogs/status-code.model';
@Injectable({
  providedIn: 'root',
})
export class StatusCodeService implements ICrudMethods<IStatusCode> {
  private readonly route: string = ENDPOINT_LINKS.StatusCode;
  constructor(private statusCodeRepository: Repository<IStatusCode>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStatusCode>> {
    return this.statusCodeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusCode> {
    return this.statusCodeRepository.getById(this.route, id);
  }

  create(model: IStatusCode): Observable<IStatusCode> {
    return this.statusCodeRepository.create(this.route, model);
  }

  update(id: string | number, model: IStatusCode): Observable<Object> {
    return this.statusCodeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.statusCodeRepository.remove(this.route, id);
  }
}
