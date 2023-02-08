import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';

export interface IReport {
  data: File;
}

@Injectable({
  providedIn: 'root',
})
export class SiabService {
  private readonly url = environment.API_REPORTS;
  // private httpClient = inject(HttpClient);
  // private authHeaders: HttpHeaders = new HttpHeaders({
  //   Authorization:
  //     'Basic ' +
  //     btoa(`${environment.API_REPORTS_USR}:${environment.API_REPORTS_PSW}`),
  // });
  constructor(private http: HttpClient, private authService: AuthService) {}

  getReport(reportName: string, params?: any): Observable<IReport> {
    // console.log(params);
    this.authService.setReportFlag(true);
    const route = `${this.url}${SiabReportEndpoints.SIAB}/${reportName}${SiabReportEndpoints.EXTENSION}`;
    return this.http
      .get<IReport>(`${route}`, { params })
      .pipe(tap(() => this.authService.setReportFlag(false)));
  }
}
