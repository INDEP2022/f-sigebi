import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditEndpoints } from 'src/app/common/constants/endpoints/ms-audit-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITableLog } from '../../models/ms-audit/table-log.model';

@Injectable({
  providedIn: 'root',
})
export class TablesLogService extends HttpService {
  private readonly endpoint: string = AuditEndpoints.GetAllByRegisterNum;
  constructor() {
    super();
    this.microservice = 'audit';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<ITableLog>>('tables-log', params);
  }

  getByNumReg(numRe: number, params: ListParams): Observable<ITableLog[]> {
    return this.get(`${this.endpoint}/${numRe}`, params);
  }
}
