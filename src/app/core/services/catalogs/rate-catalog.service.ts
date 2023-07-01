import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'endpoints';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { IRateCatalog } from '../../models/catalogs/rate-catalog.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterBaseCatService {
  // private readonly route: string = ParameterGoodEndpoints.BasePath;
  private readonly route: string = ENDPOINT_LINKS.parametergoodBase;

  constructor(
    private http: HttpClient,
    private deductiveRepository: Repository<IRateCatalog>
  ) {}
  getItems(filters: any) {
    let params = new HttpParams();

    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.http.get<IListResponse<any>>(URL, { params });
  }

  getAll(params?: ListParams): Observable<IListResponse<IRateCatalog>> {
    console.log('this.route:', this.route);
    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.deductiveRepository.getAllPaginated2(this.route, params);
  }

  newItem(payload: any) {
    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.http.post<IListResponse<any>>(URL, payload);
  }
}
