import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { IShelvesMethods } from '../interfaces/shelves.methods';
@Injectable({ providedIn: 'root' })
export class ShelvesRepository<T> implements IShelvesMethods<T> {
  ms: string = `${environment.API_URL}catalog/api/v1/shelves`;

  constructor(public readonly httpClient: HttpClient) {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`);
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

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getByCveSaveValues?(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}?text=${id}`);
  }

  // update(route: string, id: number | string, formData: Object) {
  //   const fullRoute = `${this.ms}/${route}`;
  //   return this.httpClient.put(`${fullRoute}/${id}`, formData);
  // }
  //  update(route: string, formData: Object) { //FUNCIONA
  //   return this.httpClient.put(`${this.ms}${route}`, formData);
  // }
  update(route: string, id: number | string, formData: Object) {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.put(`${fullRoute}/${id}`, formData);
  }

  create(route: string, formData: Object) {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }
  /*create(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }

  

  remove(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}/${id}`);
  }

*/
  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
