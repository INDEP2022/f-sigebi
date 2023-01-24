import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class MsGoodQueryRepository<T> {
  private httpClient = inject(HttpClient);

  constructor() {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = _params ? this.makeParams(_params) : {};
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  public getUnitLigie(route: string, params: Object): Observable<any> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.post<any>(`${fullRoute}/getUnitLigie`, params);
  }

  public getDescriptionUnitLigie(route: string, unit: string): Observable<any> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<any>(`${fullRoute}/getDescription/${unit}`);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key] ?? '');
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
