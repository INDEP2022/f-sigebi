import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';

import { ITdescCve } from '../../models/ms-parametergood/tdesccve-model';
@Injectable({
  providedIn: 'root',
})
export class TdescCveService implements ICrudMethods<ITdescCve> {
  private readonly route: string = ParameterGoodEndpoints.TDescCve;
  constructor(private goodParameterRepository: Repository<ITdescCve>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITdescCve>> {
    return this.goodParameterRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITdescCve> {
    return this.goodParameterRepository.getById(this.route, id);
  }

  create(model: ITdescCve): Observable<ITdescCve> {
    return this.goodParameterRepository.create(this.route, model);
  }

  update(id: string | number, model: ITdescCve): Observable<Object> {
    return this.goodParameterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodParameterRepository.remove(this.route, id);
  }
}
