import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { IBatteryMethods } from '../interfaces/battery-methods';
import { ListParams } from '../interfaces/list-params';
@Injectable({ providedIn: 'root' })
export class BatteryRepository<T> implements IBatteryMethods<T> {
  ms: string = `${environment.API_URL}catalog/api/v1/battery`;

  constructor(public readonly httpClient: HttpClient) {}

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
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}${id}`);
  }

  update(route: string, id: number | string, formData: Object) {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.put(`${fullRoute}/${id}`, formData);
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
