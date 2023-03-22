import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBinnacle } from '../../models/ms-audit/binnacle.model';

@Injectable({
  providedIn: 'root',
})
export class SeraLogService extends HttpService {
  constructor() {
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
}
