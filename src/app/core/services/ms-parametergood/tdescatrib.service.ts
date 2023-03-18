import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITdescAtrib } from '../../models/ms-parametergood/tdescatrib-model';
@Injectable({
  providedIn: 'root',
})
export class TdesAtribService extends HttpService {
  private readonly route = ParameterGoodEndpoints;
  constructor(
    private parametergoodRepository: ParametergoodRepository<ITdescAtrib>
  ) {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITdescAtrib>> {
    return this.parametergoodRepository.getAll(this.route.TDescAtrib, params);
  }

  getById(id: string | number) {
    const route = `${ParameterGoodEndpoints.GetAttribById}/${id}`;
    return this.get<IListResponse<ITdescAtrib>>(route);
  }

  create(tdescAtrib: ITdescAtrib) {
    return this.post(ParameterGoodEndpoints.TDescAtrib, tdescAtrib);
  }

  update(tdescAtrib: ITdescAtrib) {
    const route = `${ParameterGoodEndpoints.TDescAtrib}`;
    return this.put(route, tdescAtrib);
  }

  remove(tdescAtrib: ITdescAtrib) {
    const route = `${ParameterGoodEndpoints.TDescAtrib}`;
    return this.delete(route, tdescAtrib);
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
