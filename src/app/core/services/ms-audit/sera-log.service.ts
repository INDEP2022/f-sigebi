import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITableLog } from '../../models/ms-audit/table-log.model';

@Injectable({
  providedIn: 'root',
})
export class SeraLogService extends HttpService {
  constructor() {
    super();
    this.microservice = 'audit';
  }

  getAllFiltered(params: _Params, registerNum: number) {
    const route = `sera-log/get-info-audit-by-register-number/${registerNum}`;
    return this.get<IListResponse<ITableLog>>(route, params);
  }

  getDynamicTables(params: _Params, body: any) {
    return of(dyamicExample);
  }
}

const dyamicExample = {
  count: 1,
  data: [
    {
      no_registro: 843134374,
      id_cliente: 1382362,
      nom_razon: 'Maria Ana',
      rfc: 'HECA590409L32',
    },
  ],
};
