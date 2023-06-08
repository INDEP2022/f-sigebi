import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParameterBaseCatService {
  private readonly route: string = ParameterGoodEndpoints.BasePath;

  constructor(private http: HttpClient) {}
  getItems(filters: any) {
    let params = new HttpParams();

    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.http.get<IListResponse<any>>(URL, { params });
  }

  newItem(payload: any) {
    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.http.post<IListResponse<any>>(URL, payload);
  }
}
