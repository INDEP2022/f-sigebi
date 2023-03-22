import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { IParameter } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterModService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.ParameterMod;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IParameter>> {
    return this.get<IListResponse<IParameter>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/id/${id}`;
    return this.get(route);
  }

  create(tpenalty: IParameter) {
    return this.post(this.endpoint, tpenalty);
  }

  update(tpenalty: IParameter) {
    const route = `${this.endpoint}`;
    return this.put(route, tpenalty);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/id/${id}`;
    return this.delete(route);
  }

  newRemove(model: IParameter) {
    const route = `${this.endpoint}`;
    return this.delete(route, model);
  }
}
