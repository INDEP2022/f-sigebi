import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MsRequestRepository {
  private httpClient = inject(HttpClient);

  constructor() {}

  public getRequestById(
    route: string,
    id: number | string
  ): Observable<IRequest> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<IRequest>(`${fullRoute}/id/${id}`);
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
