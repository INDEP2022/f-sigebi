import { Injectable } from '@angular/core';
import { ReportGoodEndpoints } from 'src/app/common/constants/endpoints/ms-reportgood-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportgoodService extends HttpService {
  private readonly route = ReportGoodEndpoints;
  constructor() {
    super();
    this.microservice = ReportGoodEndpoints.BasePath;
  }

  getReportGood(params: ListParams) {
    return this.get(ReportGoodEndpoints.ReportRegCant, params);
  }
}
