import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
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

  getByIdH(id: number) {
    const route = `${this.endpointH}/${id}`;
    return this.get(route);
  }
  create(layout: number) {
    const route = `${this.endpoint}`;
    return this.post(route, layout);
  }
  add(layout: number) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-layouts-t`;
    return this.htpp.post(url, layout);
  }

  update(id: number, tiie: IComerLayouts) {
    const route = `${this.endpointH}/${id}`;
    return this.put(route, tiie);
  }
  findOne(id: number) {
    const route = `${this.endpoint}/find-one`;
    return this.post(route, id);
  }

  // remove(id: string | number) {
  //   const route = `${this.endpoint}/${id}`;
  //   return this.delete(route);
  // }

  createH(layout: IComerLayoutsH) {
    return this.post(this.endpointH, layout);
  }
}
