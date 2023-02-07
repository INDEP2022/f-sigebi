import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITevents } from '../../models/catalogs/tevents.model';
import { IUsersEventTypes } from '../../models/catalogs/users-event-types.model';

@Injectable({
  providedIn: 'root',
})
export class UserEventTypesService implements ICrudMethods<IUsersEventTypes> {
  private readonly route: string = ENDPOINT_LINKS.usuxtpevents;
  private readonly route1: string = ENDPOINT_LINKS.tevents;
  constructor(
    private usuxTpeventsRepository: Repository<IUsersEventTypes>,
    private teventsRepository: Repository<ITevents>
  ) {}

  getAllType(params?: ListParams): Observable<IListResponse<ITevents>> {
    return this.teventsRepository.getAllPaginated(this.route1, params);
  }

  getAll(params?: ListParams): Observable<IListResponse<IUsersEventTypes>> {
    return this.usuxTpeventsRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IUsersEventTypes> {
    return this.usuxTpeventsRepository.getById(this.route, id);
  }

  create(model: IUsersEventTypes): Observable<IUsersEventTypes> {
    return this.usuxTpeventsRepository.create(this.route, model);
  }

  update(id: string | number, model: IUsersEventTypes): Observable<Object> {
    return this.usuxTpeventsRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.usuxTpeventsRepository.remove(this.route, id);
  }
}
