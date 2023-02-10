import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { TvalTable1Data } from '../../../core/models/catalogs/dinamic-tables.model';
import { ListParams } from '../interfaces/list-params';
import { IDynamicCatalogMethods } from '../interfaces/ms-dynamiccatalog-methods';

@Injectable({ providedIn: 'root' })
export class DynamicCatalogRepository<T> implements IDynamicCatalogMethods<T> {
  ms: string = `${environment.API_URL}dynamiccatalog/api/v1`;

  s: string = `${environment.API_URL}api/v1`;

  constructor(public readonly httpClient: HttpClient) {}

  getById(route: string, _id?: number | string): Observable<T> {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.get<T>(`${fullRoute}/${_id}`);
  }

  getByIdData(route: string, _id?: number | string): Observable<T> {
    const fullRoute = `${this.s}/${route}`;
    return this.httpClient.get<T>(`${fullRoute}/${_id}`);
  }

  getByKeyTvalTable1(
    route: string,
    _id?: number | string
  ): Observable<IListResponse<TvalTable1Data>> {
    const fullRoute = `${this.ms}/${route}`;
    return this.httpClient.get<IListResponse<TvalTable1Data>>(
      `${fullRoute}/${_id}`
    );
  }

  //   getAllPaginated(
  //     route: string,
  //     _params?: ListParams
  //   ): Observable<IListResponse<T>> {
  //     const params = this.makeParams(_params);
  //     const fullRoute = this.buildRoute(route);
  //     return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  //   }

  // private buildRoute(route: string) {
  //     const paths = route.split('/');
  //     paths.shift();
  //     if (paths.length === 0) {
  //       return `${environment.API_URL}dynamiccatalog/api/v1/${route}`;
  //     }
  //     const ms = route.split('/')[0];
  //     return `${environment.API_URL}${ms}/api/v1/${paths.join('/')}`;
  //   }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
