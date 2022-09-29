import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IPerson } from '../models/person.model';
@Injectable({
  providedIn: 'root',
})
export class PersonService implements ICrudMethods<IPerson> {
  private readonly route: string = ENDPOINT_LINKS.Person;
  constructor(private personRepository: Repository<IPerson>) {}

  getAll(params?: ListParams): Observable<IListResponse<IPerson>> {
    return this.personRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IPerson> {
    return this.personRepository.getById(this.route, id);
  }

  create(model: IPerson): Observable<IPerson> {
    return this.personRepository.create(this.route, model);
  }

  update(id: string | number, model: IPerson): Observable<Object> {
    return this.personRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.personRepository.remove(this.route, id);
  }
}
