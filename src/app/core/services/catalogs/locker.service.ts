import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILocker } from '../../models/catalogs/locker.model';
@Injectable({
  providedIn: 'root',
})
export class LockerService implements ICrudMethods<ILocker> {
  private readonly route: string = ENDPOINT_LINKS.Locker;
  constructor(private lockerRepository: Repository<ILocker>) {}

  getAll(params?: ListParams): Observable<IListResponse<ILocker>> {
    return this.lockerRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILocker> {
    return this.lockerRepository.getById(this.route, id);
  }

  create(model: ILocker): Observable<ILocker> {
    return this.lockerRepository.create(this.route, model);
  }

  update(id: string | number, model: ILocker): Observable<Object> {
    return this.lockerRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.lockerRepository.remove(this.route, id);
  }
}
