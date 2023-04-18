import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { InterceptorSkipHeader } from 'src/app/common/interceptors/http-errors.interceptor';
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
  private readonly urlBase = environment.API_REPORTS_BASE;
  private readonly username = environment.API_REPORTS_USR;
  private readonly password = environment.API_REPORTS_PSW;
  // private httpClient = inject(HttpClient);
  // private authHeaders: HttpHeaders = new HttpHeaders({
  //   Authorization:
  //     'Basic ' +
  //     btoa(`${environment.API_REPORTS_USR}:${environment.API_REPORTS_PSW}`),
  // });
  constructor(private http: HttpClient, private authService: AuthService) {}

  private signIn() {
    this.authService.setReportFlag(true);
    return this.http
      .get(
        `${this.urlBase}j_spring_security_check?j_username=${this.username}&j_password=${this.password}`
      )
      .pipe(
        catchError(error => {
          this.authService.setReportFlag(false);
          return of(null);
        }),
        tap(() => {
          this.authService.setReportFlag(false);
        })
      );
  }

  private _getReport(reportName: string, params?: any) {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    this.authService.setReportFlag(true);
    const route = `${this.url}${SiabReportEndpoints.SIAB}/${reportName}${SiabReportEndpoints.EXTENSION}`;
    return this.http
      .get<any>(`${route}`, {
        params,
        headers,
        responseType: 'arraybuffer' as 'json',
      })
      .pipe(
        catchError(error => {
          this.authService.setReportFlag(false);
          return of(null);
        }),
        tap(() => {
          this.authService.setReportFlag(false);
        })
      );
  }

  fetchReport(reportName: string, params?: any) {
    return this.signIn().pipe(
      switchMap(() => this._getReport(reportName, params))
    );
  }

  /**
   *
   * @deprecated Cambiar a la nueva funcionalidad
   */
  getReport(reportName: string, params?: any): Observable<IReport> {
    // console.log(params);
    this.authService.setReportFlag(true);
    const route = `${this.url}${SiabReportEndpoints.SIAB}/${reportName}${SiabReportEndpoints.EXTENSION}`;
    return this.http.get<IReport>(`${route}`, { params }).pipe(
      tap(() => this.authService.setReportFlag(false)),
      catchError(() => {
        this.authService.setReportFlag(false);
        return of({ data: null });
      })
    );
  }

  //Temporal para los reportes que aún estan en construcción
  private _getReportBlank(reportName: string) {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    this.authService.setReportFlag(true);
    const route = `${this.url}/${reportName}${SiabReportEndpoints.EXTENSION}`;
    return this.http.get<any>(`${route}`, {
      headers,
      responseType: 'arraybuffer' as 'json',
    });
  }

  fetchReportBlank(reportName: string) {
    return this.signIn().pipe(
      switchMap(() => this._getReportBlank(reportName))
    );
  }
}
