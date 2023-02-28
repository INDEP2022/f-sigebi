import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { ITypeEntityGov } from '../../models/ms-parametercomer/type-entity-gov.model';

@Injectable({
  providedIn: 'root',
})
export class TypeEntityGovService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.Entities;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAllFilter(params?: _Params): Observable<IListResponse<ITypeEntityGov>> {
    return this.get<IListResponse<ITypeEntityGov>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get<ITypeEntityGov>(route);
  }

  create(tpenalty: Partial<ITypeEntityGov>) {
    return this.post<ITypeEntityGov>(this.endpoint, tpenalty);
  }

  update(id: string | number, tpenalty: Partial<ITypeEntityGov>) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
