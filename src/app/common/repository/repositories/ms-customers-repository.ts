import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { ICustomersMethods } from '../interfaces/ms-customers-methods';

@Injectable({ providedIn: 'root' })
export class CustomersRepository<T> implements ICustomersMethods<T> {
  constructor(public readonly httpClient: HttpClient) {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getById(route: string, id: number | string): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<T>(`${fullRoute}/${id}`);
  }

  getByColumn(route: string, column?: Object): Observable<IListResponse<T>> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<IListResponse<T>>(
      `${fullRoute}/columns`,
      column
    );
  }

  create(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }

  update(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}/${id}`, formData);
  }

  remove(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}/${id}`);
  }

  updateByIds(route: string, ids: Partial<T>, formData: Object) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.put(`${fullRoute}/${idsRoute}`, formData);
  }

  getByIds(route: string, ids: Partial<T>) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.get<T>(`${fullRoute}/${idsRoute}`);
  }

  removeByIds(route: string, ids: Partial<T>) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.delete(`${fullRoute}/${idsRoute}`);
  }

  postByIds(route: string, formData: Object): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}/id`, formData);
  }

  postColumns(route: string, formData: Object): Observable<IListResponse<T>> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<IListResponse<T>>(
      `${fullRoute}/columns`,
      formData
    );
  }

  private buildRoute(route: string) {
    const paths = route.split('/');
    paths.shift();
    if (paths.length === 0) {
      return `${environment.API_URL}customers/api/v1/${route}`;
    }
    const ms = route.split('/')[0];
    return `${environment.API_URL}${ms}/api/v1/${paths.join('/')}`;
  }

  private makeIdsRoute(ids: Partial<T>): string {
    const keysArray = Object.values(ids);
    return keysArray.join('/');
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
