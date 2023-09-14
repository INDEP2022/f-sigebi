import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditEndpoints } from 'src/app/common/constants/endpoints/ms-audit-endpoint';
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

  getAllByRegisterNum(registerNum: number, params: _Params) {
    const route = `${AuditEndpoints.GetAllByRegisterNum}/${registerNum}`;
    return this.get<IListResponse<IBinnacle>>(route, params);
  }

  getAllByRegisterCod(registerNum: string | number, params: _Params) {
    const route = `${AuditEndpoints.GetAllByRegisterCod} ${registerNum}`;
    return this.get<IListResponse<IBinnacle>>(route, params);
  }
  getObtnObtenUnidadesResp(params: _Params) {
    const route = `application/obtnObtenUnidadesResp`;
    return this.get<IListResponse<any>>(route, params);
  }
  postObtnGoodSinister(data: any, params: _Params) {
    const route = `application/obtnGoodSinister`;
    return this.post(route, data, params);
  }
  postSaveSinisterRecord(body: FormData): Observable<any> {
    const url = `${environment.API_URL}ldocument/api/v1/file-sinister-record/saveSinisterRecord`;
    return this.htpp.post(url, body);
  }
  postSinisterRecordFile(body: FormData): Observable<any> {
    const url = `${environment.API_URL}ldocument/api/v1/file-sinister-record/sinisterRecordFile`;
    return this.htpp.post(url, body);
  }
  postDateExport(body: any): Observable<any> {
    const url = `${environment.API_URL}massivedictation/api/v1/application/obtn-good-siniestro-fecha1-export`;
    return this.htpp.post(url, body);
  }
  postExport(body: any): Observable<any> {
    const url = `${environment.API_URL}massivedictation/api/v1/application/obtn-good-sinister-export`;
    return this.htpp.post(url, body);
  }

  getLogData(registerNum: number | string, params?: _Params) {
    return this.get(
      `application/getPupTraeRegBitacora?p_num_registro=${registerNum}`,
      params
    );
  }
}
