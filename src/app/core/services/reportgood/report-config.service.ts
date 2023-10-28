import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IReportConfig } from '../../models/reportgood/report-config.model';

@Injectable({ providedIn: 'root' })
export class ReportConfigService extends HttpService {
  constructor() {
    super();
    this.microservice = 'reportgood';
  }

  getAll(params: _Params) {
    return this.get<IListResponse<IReportConfig>>('report-config', params);
  }

  getById(id: number) {
    return this.get<IReportConfig>('report-config/' + id);
  }

  create(config: Object) {
    return this.post<IReportConfig>('report-config', config);
  }

  update(id: number, config: Object) {
    return this.put('report-config/' + id, config);
  }

  remove(id: number) {
    return this.delete('report-config/' + id);
  }
}
