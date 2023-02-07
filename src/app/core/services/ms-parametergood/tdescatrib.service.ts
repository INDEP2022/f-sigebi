import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITdescAtrib } from '../../models/ms-parametergood/tdescatrib-model';
@Injectable({
  providedIn: 'root',
})
export class TdesAtribService {
  private readonly route = ParameterGoodEndpoints;
  constructor(
    private parametergoodRepository: ParametergoodRepository<ITdescAtrib>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ITdescAtrib>> {
    return this.parametergoodRepository.getAll(this.route.TDescAtrib, params);
  }

  /*getById(id: string | number): Observable<ITdescAtrib> {
    return this.parametergoodRepository.getById(this.route, id);
  }

  create(model: ITdescAtrib): Observable<ITdescAtrib> {
    return this.parametergoodRepository.create(this.route, model);
  }

  update(id: string | number, model: ITdescAtrib): Observable<Object> {
    return this.parametergoodRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.parametergoodRepository.remove(this.route, id);
  }*/
}
