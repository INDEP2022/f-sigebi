import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITableLog } from '../../models/ms-audit/table-log.model';

@Injectable({
  providedIn: 'root',
})
export class TablesLogService extends HttpService {
  constructor() {
    super();
    this.microservice = 'audit';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<ITableLog>>('tables-log', params);
  }
}
