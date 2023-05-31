import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametergoodRepository } from 'src/app/common/repository/repositories/parametergood-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParameters } from './../../models/ms-parametergood/parameters.model';
@Injectable({
  providedIn: 'root',
})
export class ParametersService extends HttpService {
  private readonly route = ParameterGoodEndpoints;
  constructor(
    private parametergoodRepository: ParametergoodRepository<IParameters>
  ) {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IParameters>> {
    return this.parametergoodRepository.getAll(this.route.Parameters, params);
  }

  getById(id: string | number) {
    const route = `${ParameterGoodEndpoints.Parameters}/${id}`;
    return this.get<IListResponse<IParameters>>(route);
  }

  getRNomencla(params?: string): Observable<IListResponse<IParameters>> {
    return this.get<IListResponse<IParameters>>(this.route.rNomecla, params);
  }

  getPhaseEdo(date: string): Observable<IListResponse<IParameters>> {
    return this.get<IListResponse<IParameters>>(this.route.FaseEdo, date);
  }
}
