import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { IAffairTypeMethods } from '../interfaces/affair-type-methods';
import { ListParams } from '../interfaces/list-params';

@Injectable({ providedIn: 'root' })
export class AffairTypeRepository<T> implements IAffairTypeMethods<T> {
  ms: string = `${environment.API_URL}catalog/api/v1/affair-type`;

  constructor(public readonly httpClient: HttpClient) {}

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getAffairTypeById?(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}${id}`, {
      params,
    });
  }

  getAffairTypebyAffair?(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(
      `${fullRoute}?limit=10&page=1&filter.code=${id}`
    );
  }

  update(
    code: string | number,
    referralNoteType: string | number,
    formData: Object
  ) {
    const fullRoute = `${this.ms}/`;
    return this.httpClient.put(
      `${fullRoute}code/${code}/referralNoteType/${referralNoteType}`,
      formData
    );
  }

  newUpdate(formData: Object) {
    const fullRoute = `${this.ms}/`;
    return this.httpClient.put(`${fullRoute}`, formData);
  }

  create(route: string, formData: Object) {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.post<T>(`${fullRoute}`, formData);
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
