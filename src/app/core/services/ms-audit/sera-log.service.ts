import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBinnacle } from '../../models/ms-audit/binnacle.model';

@Injectable({
  providedIn: 'root',
})
export class SeraLogService extends HttpService {
  constructor(private htpp: HttpClient) {
    super();
    this.microservice = 'audit';
  }

  getDynamicTables(params: _Params, body: any) {
    return this.post<IListResponse>(
      'sera-log/dinamic-query-with-table-and-filters',
      body,
      params
    );
  }

  getAllByRegisterNum(registerNum: string | number, params: _Params) {
    const route = `sera-log/get-info-audit-by-register-number/${registerNum}`;
    return this.get<IListResponse<IBinnacle>>(route, params);
  }
  getObtnObtenUnidadesResp(params: _Params) {
    const route = `application/obtnObtenUnidadesResp`;
    return this.get<IListResponse<any>>(route, params);
  }
  postObtnGoodSinister(data: any) {
    const route = `application/obtnGoodSinister`;
    return this.post(route, data);
  }
  postSaveSinisterRecord(body: FormData): Observable<any> {
    const url = `${environment.API_URL}ldocument/api/v1/file-sinister-record/saveSinisterRecord`;
    return this.htpp.post(url, body);
  }
}
