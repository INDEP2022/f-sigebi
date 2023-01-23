import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITdescAtrib } from '../../models/ms-parametergood/tdescatrib-model';
@Injectable({
  providedIn: 'root',
})
export class TdesAtribService implements ICrudMethods<ITdescAtrib> {
  private readonly route: string = ParameterGoodEndpoints.TDescAtrib;
  constructor(private goodParameterRepository: Repository<ITdescAtrib>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITdescAtrib>> {
    return this.goodParameterRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITdescAtrib> {
    return this.goodParameterRepository.getById(this.route, id);
  }

  create(model: ITdescAtrib): Observable<ITdescAtrib> {
    return this.goodParameterRepository.create(this.route, model);
  }

  update(id: string | number, model: ITdescAtrib): Observable<Object> {
    return this.goodParameterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodParameterRepository.remove(this.route, id);
  }
}
