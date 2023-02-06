import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProviderEndpoints } from 'src/app/common/constants/endpoints/ms-provider-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerProvider } from '../../models/ms-provider/provider-model';

@Injectable({
  providedIn: 'root',
})
export class ComerProvidersService extends HttpService {
  private readonly endpoint: string = ProviderEndpoints.ComerProviders;
  constructor() {
    super();
    this.microservice = ProviderEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerProvider>> {
    return this.get<IListResponse<IComerProvider>>(this.endpoint, params);
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<IComerProvider>> {
    return this.get<IListResponse<IComerProvider>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(provider: IComerProvider) {
    return this.post(this.endpoint, provider);
  }

  update(id: string | number, provider: IComerProvider) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, provider);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
