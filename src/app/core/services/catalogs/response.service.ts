import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IResponse } from '../../models/catalogs/response.model';
@Injectable({
  providedIn: 'root',
})
export class ResponseService implements ICrudMethods<IResponse> {
  private readonly route: string = ENDPOINT_LINKS.Response;
  constructor(private responseRepository: Repository<IResponse>) {}

  getAll(params?: ListParams): Observable<IListResponse<IResponse>> {
    return this.responseRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IResponse> {
    return this.responseRepository.getById(this.route, id);
  }

  create(model: IResponse): Observable<IResponse> {
    return this.responseRepository.create(this.route, model);
  }

  update(id: string | number, model: IResponse): Observable<Object> {
    return this.responseRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.responseRepository.remove(this.route, id);
  }
}
