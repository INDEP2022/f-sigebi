import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProviderEndpoints } from 'src/app/common/constants/endpoints/ms-provider-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProviderRepository } from '../../../common/repository/repositories/ms-provider-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerProvider } from '../../models/ms-provider/provider-model';

@Injectable({
  providedIn: 'root',
})
export class ComerProvidersService {
  private readonly route: string = ProviderEndpoints.ComerProviders;
  constructor(
    private providerRepository: ProviderRepository<IComerProvider>,
    public readonly httpClient: HttpClient
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IComerProvider>> {
    return this.providerRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IComerProvider> {
    return this.providerRepository.getById(this.route, id);
  }

  create(model: IComerProvider): Observable<IComerProvider> {
    return this.providerRepository.create(this.route, model);
  }

  update(id: string | number, model: IComerProvider): Observable<Object> {
    return this.providerRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.providerRepository.remove(this.route, id);
  }
}
