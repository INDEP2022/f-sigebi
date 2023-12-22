import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { CompensationEndpoints } from 'src/app/common/constants/endpoints/ms-orderentry-endpoint';
import { ICompensation } from '../../models/compensation-options/compensation';

@Injectable({
  providedIn: 'root',
})
export class CompensationService extends HttpService {
  constructor() {
    super();
    this.microservice = CompensationEndpoints.BaseCompensation;
  }

  getcompensation(
    id?: any,
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/get-EventData',
      id,
      params
    );
  }

  getAllcompensation(
    params?: ListParams | string
  ): Observable<IListResponse<ICompensation>> {
    const route = CompensationEndpoints.opinions;
    return this.get<IListResponse<ICompensation>>(route, params);
  }

  createcompensation(body: Object) {
    const route = CompensationEndpoints.opinions;
    return this.post(route, body);
  }

  updatecompensation(body: ICompensation) {
    const route = `${CompensationEndpoints.opinions}/${body.requestId}`;
    return this.put(route, body);
  }

  removecompensation(id: number | string) {
    const route = `${CompensationEndpoints.opinions}/${id}`;
    return this.delete(route);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
