import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { ListParams } from '../interfaces/list-params';
import { IDocumentsTypeMethods } from '../interfaces/ms-documents-type-methods';

@Injectable({ providedIn: 'root' })
export class DocumentsTypeRepository<T> implements IDocumentsTypeMethods<T> {
  ms: string = `${environment.API_URL}documents/api/v1/`;

  constructor(public readonly httpClient: HttpClient) {}

  getAll(route: string, _params?: ListParams) {
    const fullRoute = `${this.ms}${route}`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<T>>(fullRoute, { params });
  }

  getByFilters(route: string) {
    console.log('1');
    const fullRoute = `${this.ms}${route}`;
    return this.httpClient.get<IListResponse<T>>(fullRoute);
  }

  getById(route: string, id: string | number): Observable<IListResponse<T>> {
    const fullRoute = `${this.ms}${route}${id}`;
    return this.httpClient.get<IListResponse<T>>(fullRoute);
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
    const fullRoute = `${this.ms}${route}/${id}`;
    return this.httpClient.delete<IListResponse<T>>(fullRoute);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    // httpParams = httpParams.append('filter.cveTypeInventory', filter);
    return httpParams;
  }
}
