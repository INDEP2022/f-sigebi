import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ProcedureManagementEndPoints } from 'src/app/common/constants/endpoints/ms-proceduremanagement-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { IManagementArea } from '../../models/ms-proceduremanagement/ms-proceduremanagement.interface';

@Injectable({
  providedIn: 'root',
})
export class DocReceptionRegisterService extends HttpService {
  microsevice: string = '';
  constructor() {
    super();
  }

  getStations(params?: string): Observable<IListResponse<IStation>> {
    let partials = ENDPOINT_LINKS.Station.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IStation>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getAuthorities(params?: string): Observable<IListResponse<IAuthority>> {
    let partials = ENDPOINT_LINKS.Authority.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IAuthority>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getIdentifiers(params?: string): Observable<IListResponse<IIdentifier>> {
    let partials = ENDPOINT_LINKS.Identifier.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IIdentifier>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getDepartaments(
    self?: DocReceptionRegisterService,
    params?: string
  ): Observable<IListResponse<IDepartment>> {
    let partials = ENDPOINT_LINKS.Departament.split('/');
    self.microservice = partials[0];
    return self
      .get<IListResponse<IDepartment>>(partials[1], params)
      .pipe(tap(() => (this.microservice = '')));
  }

  getManagementAreas(
    params?: string
  ): Observable<IListResponse<IManagementArea>> {
    this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
    return this.get<IListResponse<IManagementArea>>(
      ProcedureManagementEndPoints.ManagamentArea,
      params
    ).pipe(tap(() => (this.microservice = '')));
  }

  // protected get<T = any>(route: string, _params?: _Params) {
  //   const params = this.getParams(_params);
  //   const url = this.buildRoute(route);
  //   return this.httpClient.get<T>(`${url}`, { params });
  // }

  // private buildRoute(route: string): string {
  //   return `${this.url}${this.microservice}/${this.prefix}${route}`;
  // }

  // private getParams(rawParams: _Params) {
  //   if (rawParams instanceof HttpParams) {
  //     return rawParams;
  //   }

  //   if (typeof rawParams === 'string') {
  //     return new HttpParams({ fromString: rawParams });
  //   }

  //   if (rawParams instanceof ListParams) {
  //     return new HttpParams({ fromObject: rawParams });
  //   }

  //   return new HttpParams({ fromObject: rawParams });
  // }
}
