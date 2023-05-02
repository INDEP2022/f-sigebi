import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TyperateEndpoint } from 'src/app/common/constants/endpoints/typerate.endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Ityperate } from '../../models/ms-type-rate/typerate.model';

@Injectable({
  providedIn: 'root',
})
export class TyperateService extends HttpService {
  private readonly endpoint: string = TyperateEndpoint.BasePath;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private typerateRepository: Repository<Ityperate>) {
    super();
    this.microservice = TyperateEndpoint.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<Ityperate>> {
    return this.get<IListResponse<Ityperate>>(`/type-rate`, params);
  }

  create(currency: Ityperate) {
    const route = `${environment.API_URL}typerate/api/v1/type-rate`;
    return this.httpClient.post(route, currency);
  }

  update(currency: Ityperate) {
    const route = `${environment.API_URL}typerate/api/v1/type-rate`;
    return this.httpClient.put(route, currency);
  }
}
