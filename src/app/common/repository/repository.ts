import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from './interfaces/list-params';
import { IRepository } from './interfaces/repository.interface';

@Injectable({ providedIn: 'root' })
export class Repository<T> implements IRepository<T> {
  constructor(public readonly httpClient: HttpClient) {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(
      `${environment.API_URL}${route}`,
      { params }
    );
  }

  getById(route: string, id: number | string): Observable<T> {
    return this.httpClient.get<T>(`${environment.API_URL}${route}/${id}`);
  }

  create(route: string, formData: Object) {
    return this.httpClient.post<T>(`${environment.API_URL}${route}`, formData);
  }

  update(route: string, id: number | string, formData: Object) {
    return this.httpClient.put(
      `${environment.API_URL}${route}/${id}`,
      formData
    );
  }

  remove(route: string, id: number | string) {
    return this.httpClient.delete(`${environment.API_URL}${route}/${id}`);
  }

  updateByIds(route: string, ids: Partial<T>, formData: Object) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.put(
      `${environment.API_URL}${route}/${idsRoute}`,
      formData
    );
  }

  getByIds(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.get<T>(`${environment.API_URL}${route}/${idsRoute}`);
  }

  removeByIds(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.delete(`${environment.API_URL}${route}/${idsRoute}`);
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
  //Temporales
  getAllPaginated2(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(
      `${environment.API_URL2}${route}`,
      { params }
    );
  }

  getById2(route: string, id: number | string): Observable<T> {
    return this.httpClient.get<T>(`${environment.API_URL2}${route}/${id}`);
  }

  create2(route: string, formData: Object) {
    return this.httpClient.post<T>(`${environment.API_URL2}${route}`, formData);
  }

  update2(route: string, id: number | string, formData: Object) {
    return this.httpClient.put(
      `${environment.API_URL2}${route}/${id}`,
      formData
    );
  }

  remove2(route: string, id: number | string) {
    return this.httpClient.delete(`${environment.API_URL2}${route}/${id}`);
  }

  updateByIds2(route: string, ids: Partial<T>, formData: Object) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.put(
      `${environment.API_URL2}${route}/${idsRoute}`,
      formData
    );
  }

  getByIds2(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.get<T>(
      `${environment.API_URL2}${route}/${idsRoute}`
    );
  }

  removeByIds2(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.delete(
      `${environment.API_URL2}${route}/${idsRoute}`
    );
  }
}
