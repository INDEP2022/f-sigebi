import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class MsHistoryGoodRepository {
  private httpClient = inject(HttpClient);

  constructor() {}

  getAllPaginated(
    route: string,
    _params?: ListParams
  ): Observable<IListResponse<IHistoryGood>> {
    const params = _params ? this.makeParams(_params) : {};
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<IHistoryGood>>(
      `${fullRoute}/find-all`,
      { params }
    );
  }

  getByGoodAndProcess(
    route: string,
    params: string
  ): Observable<IListResponse<IHistoryGood>> {
    const fullRoute = this.buildRoute(route);
    console.log(`${fullRoute}?${params}`);
    return this.httpClient.get<IListResponse<IHistoryGood>>(
      `${fullRoute}?${params}`
    );
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
