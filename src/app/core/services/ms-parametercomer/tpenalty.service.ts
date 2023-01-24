import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { ParameterComerRepository } from '../../../common/repository/repositories/ms-parametercomer-repository';
import { ITPenalty } from '../../models/ms-parametercomer/penalty-type.model';

@Injectable({
  providedIn: 'root',
})
export class TPenaltyService {
  private readonly route: string = ParameterComerEndpoints.TPenalty;
  constructor(
    private repository: ParameterComerRepository<ITPenalty>,
    public readonly httpClient: HttpClient
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ITPenalty>> {
    return this.repository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITPenalty> {
    return this.repository.getById(this.route, id);
  }

  create(model: ITPenalty): Observable<ITPenalty> {
    return this.repository.create(this.route, model);
  }

  update(id: string | number, model: ITPenalty): Observable<Object> {
    return this.repository.update(`${this.route}/id`, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.repository.remove(`${this.route}/id`, id);
  }
}
