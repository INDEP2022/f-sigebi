import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
@Injectable({
  providedIn: 'root',
})
export class CopiesByTradeService {
  constructor(private httpClient: HttpClient) {}

  getFilter(params: string) {
    return this.httpClient.get<IListResponse<any>>(
      `${environment.API_URL}officemanagement/api/v1/copies-by-trade?${params}`
    );
  }

  create(job: any) {
    const route = `${environment.API_URL}officemanagement/api/v1/copies-by-trade`;
    return this.httpClient.post(route, job);
  }
}
