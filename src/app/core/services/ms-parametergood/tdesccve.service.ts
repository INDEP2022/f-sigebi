import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { IListResponse } from '../../interfaces/list-response.interface';

import { ITdescCve } from '../../models/ms-parametergood/tdesccve-model';
@Injectable({
  providedIn: 'root',
})
export class TdescCveService {
  private readonly route = ParameterGoodEndpoints;
  constructor(
    private parametergoodRepository: ParametergoodRepository<ITdescCve>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ITdescCve>> {
    return this.parametergoodRepository.getAll(this.route.TDescCve, params);
  }

  // create(model: ITdescCve): Observable<ITdescCve> {
  //   return this.parametergoodRepository.create(this.route, model);
  // }

  update(id: string | number, model: ITdescCve): Observable<Object> {
    return this.parametergoodRepository.update(this.route.TDescCve, id, model);
  }

  // remove(id: string | number): Observable<Object> {
  //   return this.parametergoodRepository.remove(this.route, id);
  // }

  getByLogicalTables(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ITdescCve>> {
    return this.parametergoodRepository.getByLogicalTables(
      this.route.TDescCve,
      id,
      params
    );
  }
}
