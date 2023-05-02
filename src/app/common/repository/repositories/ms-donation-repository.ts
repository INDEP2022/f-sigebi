import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { IDonationMethods } from '../interfaces/ms-donation.interface';

@Injectable({ providedIn: 'root' })
export class DonationRepository<T> implements IDonationMethods<T> {
  ms: string = `${environment.API_URL}donationgood/api/v1/`;

  constructor(public readonly httpClient: HttpClient) {}

  getAll(route: string, _params?: ListParams): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(fullRoute, { params });
  }

  update(route: string, id: number | string, formData: Object) {
    const fullRoute = `${this.ms}${route}${id}`;
    return this.httpClient.put<IListResponse<T>>(fullRoute, formData);
  }

  create(route: string, formData: Object) {
    const fullRoute = `${this.ms}${route}`;
    return this.httpClient.post<IListResponse<T>>(fullRoute, formData);
  }

  remove(route: string, id: number | string) {
    const fullRoute = `${this.ms}${route}${id}`;
    return this.httpClient.delete(fullRoute);
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
