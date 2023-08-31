import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import {
  IComerLayouts,
  IComerLayoutsH,
  IComerLayoutsW,
  ILay,
} from '../../models/ms-parametercomer/parameter';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutsConfigService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.Layouts;
  private readonly endpointH: string = ParameterComerEndpoints.layoutSH;
  constructor(private htpp: HttpClient, private authService: AuthService) {
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
  getById(params?: ListParams) {
    const route = `${this.endpoint}}`;
    return this.get(route, params);
  }

  createH(layout: IComerLayoutsH) {
    const route = `${this.endpointH}`;
    return this.post(route, layout);
  }
  create(layout: IComerLayoutsW) {
    const route = `${this.endpoint}`;
    return this.post(route, layout);
  }
  add(layout: number) {
    const url = `${environment.API_URL}parametercomer/api/v1/comer-layouts-t`;
    return this.htpp.post(url, layout);
  }

  // update(layout: IComerLayouts) {
  //   const route = `${this.endpoint}`;
  //   return this.put(route, layout);
  // }
  // update(layout: IComerLayouts) {
  //   const route = `${this.endpoint}`;
  //   return this.put(route, layout);
  // }
  update(idLayout: number, layout: IComerLayouts) {
    const route = `${this.endpoint}/id/${idLayout}`;
    return this.put(route, layout);
  }

  findOne(idLayout: ILay) {
    const route = `${this.endpoint}/find-one`;
    return this.post(route, idLayout);
  }

  remove(id: ILay) {
    const route = `${this.endpoint}`;
    return this.delete(route, id);
  }

  // createH(layout: IComerLayouts) {
  //   return this.post(this.endpointH, layout);
  // }

  updateL(idLayout: number, params: IComerLayoutsW) {
    const route = `${this.endpoint}/id/${idLayout}`;
    return this.put(route, params);
    // return this.httpClient.request<IComerLayoutsH>('update', route, {
    //   body: params,
    // });
  }

  updatelayoutSH(
    id: number,
    body: Partial<IComerLayoutsW>
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ParameterComerEndpoints.layoutSH + '/' + id,
      body
    );
  }
  deletelayoutSH(
    id: number,
    body: Partial<IComerLayoutsW>
  ): Observable<IListResponse<any>> {
    return this.delete<IListResponse<any>>(
      ParameterComerEndpoints.layoutSH + '/' + id,
      body
    );
  }

  getAllLayouts_TotalT(params?: ListParams) {
    //: Observable<IListResponse<IComerLayouts>> {
    // return this.get<IListResponse<IComerLayouts>>(this.endpoint, params);
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    this.authService.setReportFlag(true);
    const route = `${this.url}/${this.microservice}/${this.prefix}/${ParameterComerEndpoints.Layouts}`;
    return this.htpp.get<any>(`${route}`, {
      headers,
      params,
    });
  }
}
