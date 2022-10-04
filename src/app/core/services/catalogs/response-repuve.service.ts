import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IResponseRepuve } from '../../models/catalogs/response-repuve.model';
@Injectable({
  providedIn: 'root',
})
export class ResponseRepuveService implements ICrudMethods<IResponseRepuve> {
  private readonly route: string = ENDPOINT_LINKS.ResponseRepuve;
  constructor(private responseRepuveRepository: Repository<IResponseRepuve>) {}

  getAll(params?: ListParams): Observable<IListResponse<IResponseRepuve>> {
    return this.responseRepuveRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IResponseRepuve> {
    return this.responseRepuveRepository.getById(this.route, id);
  }

  create(model: IResponseRepuve): Observable<IResponseRepuve> {
    return this.responseRepuveRepository.create(this.route, model);
  }

  update(id: string | number, model: IResponseRepuve): Observable<Object> {
    return this.responseRepuveRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.responseRepuveRepository.remove(this.route, id);
  }
}
