import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStateRepuve } from '../../models/catalogs/state-repuve.model';

@Injectable({
  providedIn: 'root',
})
export class StateRepuveService implements ICrudMethods<IStateRepuve> {
  private readonly route: string = ENDPOINT_LINKS.EstRepuve;
  constructor(private estRepuveRepository: Repository<IStateRepuve>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStateRepuve>> {
    return this.estRepuveRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStateRepuve> {
    return this.estRepuveRepository.getById(this.route, id);
  }

  create(model: IStateRepuve): Observable<IStateRepuve> {
    return this.estRepuveRepository.create(this.route, model);
  }

  update(id: string | number, model: IStateRepuve): Observable<Object> {
    return this.estRepuveRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.estRepuveRepository.remove(this.route, id);
  }
}
