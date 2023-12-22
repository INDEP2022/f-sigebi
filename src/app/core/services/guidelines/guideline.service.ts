import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { GuidelinesEndpoints } from 'src/app/common/constants/endpoints/ms-orderentry-endpoint';
import { IGuidelines } from '../../models/guidelines/guidelines';

@Injectable({
  providedIn: 'root',
})
export class GuidelinesService extends HttpService {
  constructor() {
    super();
    this.microservice = GuidelinesEndpoints.BaseGuidelines;
  }

  getGuidelines(
    params?: ListParams | string
  ): Observable<IListResponse<IGuidelines>> {
    const route = GuidelinesEndpoints.guidelines;
    return this.get<IListResponse<IGuidelines>>(route, params);
  }

  getAllGuidelines(
    params?: ListParams | string
  ): Observable<IListResponse<IGuidelines>> {
    const route = GuidelinesEndpoints.guidelines;
    return this.get<IListResponse<IGuidelines>>(route, params);
  }

  createGuidelines(body: Object) {
    const route = GuidelinesEndpoints.guidelines;
    return this.post(route, body);
  }

  updateGuidelines(body: IGuidelines) {
    const route = `${GuidelinesEndpoints.guidelines}`;
    return this.put(route, body);
  }

  removeGuidelines(id: number | string) {
    const route = `${GuidelinesEndpoints.guidelines}/${id}`;
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
