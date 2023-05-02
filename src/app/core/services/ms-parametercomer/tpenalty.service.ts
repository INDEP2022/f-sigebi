import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { ITPenalty } from '../../models/ms-parametercomer/penalty-type.model';

@Injectable({
  providedIn: 'root',
})
export class TPenaltyService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.TPenalty;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITPenalty>> {
    return this.get<IListResponse<ITPenalty>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/id/${id}`;
    return this.get(route);
  }

  create(tpenalty: ITPenalty) {
    return this.post(this.endpoint, tpenalty);
  }

  update(id: string | number, tpenalty: ITPenalty) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, tpenalty);
  }

  newUpdate(model: ITPenalty) {
    const route = `${this.endpoint}`;
    return this.put(route, model);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
