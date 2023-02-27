import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import {
  IComerLayouts,
  IComerLayoutsH,
} from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class LayoutsConfigService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.Layouts;
  private readonly endpointH: string = ParameterComerEndpoints.layoutSH;
  constructor(private htpp: HttpClient) {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAllLayouts(params?: ListParams): Observable<IListResponse<IComerLayouts>> {
    return this.get<IListResponse<IComerLayouts>>(this.endpoint, params);
  }
  getAllLayoutsH(
    params?: ListParams
  ): Observable<IListResponse<IComerLayoutsH>> {
    return this.get<IListResponse<IComerLayoutsH>>(this.endpointH, params);
  }
  getByIdH(id: string | number) {
    const route = `${this.endpointH}/${id}`;
    return this.get(route);
  }
  create(layout: IComerLayouts) {
    return this.post(this.endpoint, layout);
  }

  update(id: string | number, tiie: IComerLayouts) {
    const route = `${this.endpointH}/${id}`;
    return this.put(route, tiie);
  }

  // remove(id: string | number) {
  //   const route = `${this.endpoint}/${id}`;
  //   return this.delete(route);
  // }

  // create(layout: IComerLayoutsH) {
  //   return this.post(this.endpointH, layout);
  // }
}
