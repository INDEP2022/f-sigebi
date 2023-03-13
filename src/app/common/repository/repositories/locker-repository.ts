import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { ILockerMethods } from '../interfaces/locker-methods';
@Injectable({ providedIn: 'root' })
export class LockerRepository<T> implements ILockerMethods<T> {
  ms: string = `${environment.API_URL}catalog/api/v1`;

  constructor(public readonly httpClient: HttpClient) {}

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  getByCveSaveValues?(
    route: string,
    saveValueKey: string | number,
    numBattery: string | number,
    numShelf: string | number,
    _params?: ListParams
  ): Observable<IListResponse<any>> {
    const fullRoute = `${this.ms}/${route}`;
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(
      `${fullRoute}?filter.saveValueKey=${saveValueKey}&filter.numBattery=${numBattery}&filter.numShelf=${numShelf}`
    );
  }

  update(formData: Object) {
    const fullRoute = `${this.ms}/locker`;
    return this.httpClient.put(`${fullRoute}`, formData);
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
