import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfficeManagementEndpoint } from 'src/app/common/constants/endpoints/office-management-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILegalTrade } from '../../models/legal-trades/legal-trades';

@Injectable({
  providedIn: 'root',
})
export class LegalTradesService extends HttpService {
  constructor() {
    super();
    this.microservice = OfficeManagementEndpoint.BasePath;
  }

  getLegalTrades(
    id?: any,
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'http://sigebimstest.indep.gob.mx/',
      id,
      params
    );
  }

  getAllLegalTrades(
    params?: ListParams | string
  ): Observable<IListResponse<ILegalTrade>> {
    const route = OfficeManagementEndpoint.LegalTrades;
    return this.get<IListResponse<ILegalTrade>>(route, params);
  }

  createLegalTrades(body: Object) {
    const route = OfficeManagementEndpoint.LegalTrades;
    return this.post(route, body);
  }

  updateLegalTrades(body: ILegalTrade) {
    const route = `${OfficeManagementEndpoint.LegalTrades}/${body.jobLegalId}`;
    return this.put(route, body);
  }

  removeLegalTrades(id: number | string) {
    const route = `${OfficeManagementEndpoint.LegalTrades}/${id}`;
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
