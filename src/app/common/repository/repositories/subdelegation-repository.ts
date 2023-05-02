import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
@Injectable({ providedIn: 'root' })
export class SubDelegationRepository<T> implements SubDelegationRepository<T> {
  ms: string = `${environment.API_URL}catalog/api/v1/subdelegation`;

  constructor(public readonly httpClient: HttpClient) {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`);
  }

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  create(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }

  update(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}`, formData);
  }

  getById(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = _params ? this.makeParams(_params) : {};
    const filter: string = '?limit=10&page=1&filter.delegationNumber=';
    return this.httpClient.get<IListResponse<T>>(
      `${environment.API_URL}${route}${filter}${id}`,
      { params }
    );
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  private buildRoute(route: string) {
    const paths = route.split('/');
    paths.shift();
    if (paths.length === 0) {
      return `${environment.API_URL}catalog/api/v1/${route}`;
    }
    const ms = route.split('/')[0];
    return `${environment.API_URL}${ms}/api/v1/${paths.join('/')}`;
  }
}
