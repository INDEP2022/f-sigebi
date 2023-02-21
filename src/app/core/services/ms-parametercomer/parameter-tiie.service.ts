import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { ITiieV1 } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterTiieService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.ParameterMod;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITiieV1>> {
    return this.get<IListResponse<ITiieV1>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/id/${id}`;
    return this.get(route);
  }

  create(tiie: ITiieV1) {
    return this.post(this.endpoint, tiie);
  }

  // update(id: string | number, tiie: ITiieV1) {
  //   const route = `${this.endpoint}/id/${id}`;
  //   return this.put(route, tiie);
  // }

  // remove(id: string | number) {
  //   const route = `${this.endpoint}/id/${id}`;
  //   return this.delete(route);
  // }
}
