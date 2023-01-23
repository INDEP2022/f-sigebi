import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MsGoodQueryRepository {
  private httpClient = inject(HttpClient);

  constructor() {}

  public getUnitLigie(route: string, params: Object): Observable<any> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.post<any>(`${fullRoute}/getUnitLigie`, params);
  }

  public getDescriptionUnitLigie(route: string, unit: string): Observable<any> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<any>(`${fullRoute}/getDescription/${unit}`);
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
