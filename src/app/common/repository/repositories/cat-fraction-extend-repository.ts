import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { environment } from 'src/environments/environment';
import { ICatFraction } from '../interfaces/cat-fraction.interface';

@Injectable({
  providedIn: 'root',
})
export class CatFractionExtendRepository implements ICatFraction {
  public readonly httpClient = inject(HttpClient);

  constructor() {}

  getByParendId(
    route: string,
    id: number | string
  ): Observable<IListResponse<IFraction>> {
    let fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<IFraction>>(
      `${fullRoute}/parentId/${id}`
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
}
