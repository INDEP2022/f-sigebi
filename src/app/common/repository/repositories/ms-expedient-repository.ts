import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { IExpedientMethods } from '../interfaces/ms-expedient-methods';

@Injectable({ providedIn: 'root' })
export class ExpedientRepository<T> implements IExpedientMethods<T> {
  ms: string = `${environment.API_URL}expedient/api/v1`;

  constructor(public readonly httpClient: HttpClient) {}

  getById(route: string, _id?: number | string): Observable<T> {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.get<T>(`${fullRoute}/${_id}`);
  }

  /*create(route: string, formData: Object) {
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

*/
  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
