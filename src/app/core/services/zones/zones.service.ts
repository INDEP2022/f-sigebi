import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDataZones } from 'src/app/pages/administrative-processes/administration-third/zones/zones/zones-columns';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IZone } from '../../models/administrative-processes/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private http: HttpClient) {}

  getZones(params?: ListParams): Observable<IListResponse<IDataZones>> {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }

    const url = `${environment.API_URL}catalog/api/v1/zones-contract`;
    return this.http.get<IListResponse<IDataZones>>(url, {
      params: httpParams,
    });
  }

  getZoneContractCoordinate(
    params?: ListParams
  ): Observable<IListResponse<IZone>> {
    const url = `${environment.API_URL}contract/api/v1/zone-contract-coordinates`;
    return this.http.get<IListResponse<IZone>>(url, { params });
  }
}
