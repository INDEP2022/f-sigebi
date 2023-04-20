import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';

import { ITdescCve } from '../../models/ms-parametergood/tdesccve-model';
@Injectable({
  providedIn: 'root',
})
export class TdescCveService extends HttpService {
  private readonly route = ParameterGoodEndpoints;
  constructor(
    private parametergoodRepository: ParametergoodRepository<ITdescCve>,
    private htpp: HttpClient
  ) {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITdescCve>> {
    return this.parametergoodRepository.getAll(this.route.TDescCve, params);
  }

  create(model: ITdescCve): Observable<ITdescCve> {
    return this.parametergoodRepository.create(this.route.TDescCve, model);
  }
  update(id: string | number, model: ITdescCve): Observable<Object> {
    return this.parametergoodRepository.update(this.route.TDescCve, id, model);
  }

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

  getById(id: string | number): Observable<ITdescCve> {
    return this.parametergoodRepository.getById(this.route.TDescCve, id);
  }

  getById2(id: string | number) {
    const url = `${environment.API_URL}parametergood/api/v1/tdesccve/${id}`;
    return this.htpp.get(url);
  }

  create2(model: ITdescCve) {
    return this.post(ParameterGoodEndpoints.TDescCve, model);
  }

  update2(id: string | number, model: ITdescCve) {
    const route = `${ParameterGoodEndpoints.TDescCve}/${id}`;
    return this.put(route, model);
  }

  remove(id: string | number) {
    const route = `${ParameterGoodEndpoints.TDescCve}/${id}`;
    return this.delete(route);
  }
}
