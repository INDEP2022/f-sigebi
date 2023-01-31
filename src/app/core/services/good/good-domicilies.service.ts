import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDomicilies } from '../../models/good/good.model';
import { IRequest } from '../../models/requests/request.model';

@Injectable({
  providedIn: 'root',
})
export class GoodDomiciliesService implements ICrudMethods<IDomicilies> {
  private route: string = GoodEndpoints.Domicilies;
  private domiciliesRepository = inject(Repository<IDomicilies>);
  constructor() {}

  getAll(params?: ListParams): Observable<IListResponse<IDomicilies>> {
    //return this.requestRepository.getAllPaginated(this.route, params);
    return this.domiciliesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDomicilies> {
    return this.domiciliesRepository.getById(this.route, id);
  }

  create(model: IRequest): Observable<IDomicilies> {
    return this.domiciliesRepository.create(this.route, model);
  }

  update(id: string | number, model: IDomicilies): Observable<Object> {
    return this.domiciliesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.domiciliesRepository.remove(this.route, id);
  }
}
