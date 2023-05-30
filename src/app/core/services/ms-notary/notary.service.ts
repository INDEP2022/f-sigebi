import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerNotariostercs } from '../../models/catalogs/notary.model';

@Injectable({
  providedIn: 'root',
})
export class ComerNotariesTercsService {
  // private readonly route = ComerNotariesTercsEndpoints;
  ms: string = `${environment.API_URL}notary/api/v1`;
  constructor(public readonly httpClient: HttpClient) {
    // super();
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerNotariostercs>> {
    const fullRoute = `${this.ms}/comer-notaries-tercs/NRAA`;

    return this.httpClient.get<IListResponse<IComerNotariostercs>>(
      `${fullRoute}`,
      { params }
    );
  }

  create(params: any): Observable<IListResponse<IComerNotariostercs>> {
    const fullRoute = `${this.ms}/comer-notaries-tercs`;

    return this.httpClient.post<IListResponse<IComerNotariostercs>>(
      `${fullRoute}`,
      params
    );
  }

  update(id: any, params: any): Observable<IListResponse<IComerNotariostercs>> {
    const fullRoute = `${this.ms}/comer-notaries-tercs`;

    return this.httpClient.put<IListResponse<IComerNotariostercs>>(
      `${fullRoute}/${id}`,
      params
    );
  }

  remove(id: any): Observable<IListResponse<IComerNotariostercs>> {
    const fullRoute = `${this.ms}/comer-notaries-tercs`;

    return this.httpClient.delete<IListResponse<IComerNotariostercs>>(
      `${fullRoute}/${id}`
    );
  }

  getById(id?: any): Observable<IListResponse<IComerNotariostercs>> {
    const fullRoute = `${this.ms}/comer-notaries-tercs/${id}`;

    return this.httpClient.get<IListResponse<IComerNotariostercs>>(
      `${fullRoute}`
    );
  }
}
