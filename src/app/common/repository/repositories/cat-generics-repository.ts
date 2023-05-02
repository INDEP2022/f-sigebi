import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { environment } from 'src/environments/environment';
import { ICatGeneric } from '../interfaces/cat-generic.interface';
import { ListParams } from '../interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class CatGeneticsRepository implements ICatGeneric {
  public readonly httpClient = inject(HttpClient);

  constructor() {}

  getGenericBySearch(
    route: string,
    _params: ListParams
  ): Observable<IListResponse<IGeneric>> {
    const params = _params ? this.makeParams(_params) : {};
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<IGeneric>>(`${fullRoute}/search`, {
      params,
    });
  }

  getGenericByFilter(
    route: string,
    _params: ListParams
  ): Observable<IListResponse<IGeneric>> {
    const params = _params ? this.makeParams(_params) : {};
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<IGeneric>>(`${fullRoute}`, {
      params,
    });
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

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key] ?? '');
    });
    return httpParams;
  }
}
