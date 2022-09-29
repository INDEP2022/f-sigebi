import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IRack } from '../models/rack.model';
@Injectable({
  providedIn: 'root',
})
export class RackService implements ICrudMethods<IRack> {
  private readonly route: string = ENDPOINT_LINKS.Rack;
  constructor(private rackRepository: Repository<IRack>) {}

  getAll(params?: ListParams): Observable<IListResponse<IRack>> {
    return this.rackRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRack> {
    return this.rackRepository.getById(this.route, id);
  }

  create(model: IRack): Observable<IRack> {
    return this.rackRepository.create(this.route, model);
  }

  update(id: string | number, model: IRack): Observable<Object> {
    return this.rackRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.rackRepository.remove(this.route, id);
  }
}
