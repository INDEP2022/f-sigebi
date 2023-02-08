import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SiabReportEndpoints } from '../../../common/constants/endpoints/siab-reports-endpoints';

export interface IReport {
  data: File;
}

@Injectable({
  providedIn: 'root',
})
export class SiabService {
  private readonly url = environment.API_REPORTS;
  private httpClient = inject(HttpClient);
  constructor() {
    //super();
    //this.microservice = SiabReportEndpoints.SIAB
  }

  getReport(
    reportName: SiabReportEndpoints,
    params?: any
  ): Observable<IReport> {
    console.log(params);
    const route = `${this.url}${reportName}.pdf`;
    return this.httpClient.get<IReport>(`${route}`, { params });
  }
}
