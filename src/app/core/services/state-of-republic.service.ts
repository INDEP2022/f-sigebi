import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IStateOfRepublic } from '../models/state-of-republic.model';
@Injectable({
  providedIn: 'root',
})
export class StateOfRepublicService implements ICrudMethods<IStateOfRepublic> {
  private readonly route: string = ENDPOINT_LINKS.StateOfRepublic;
  constructor(
    private stateOfRepublicRepository: Repository<IStateOfRepublic>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IStateOfRepublic>> {
    return this.stateOfRepublicRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStateOfRepublic> {
    return this.stateOfRepublicRepository.getById(this.route, id);
  }

  create(model: IStateOfRepublic): Observable<IStateOfRepublic> {
    return this.stateOfRepublicRepository.create(this.route, model);
  }

  update(id: string | number, model: IStateOfRepublic): Observable<Object> {
    return this.stateOfRepublicRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.stateOfRepublicRepository.remove(this.route, id);
  }
}
