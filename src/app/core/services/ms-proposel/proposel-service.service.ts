import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProposelEndpoint } from 'src/app/common/constants/endpoints/ms-sirsae/proposel-endpoint';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProposel } from '../../models/sirsae-model/proposel-model/proposel-model';
@Injectable({
  providedIn: 'root',
})
export class ProposelServiceService extends HttpService {
  private readonly route = ProposelEndpoint.Proposel;
  constructor() {
    super();
    this.microservice = this.route;
  }

  getAll(params?: ListParams): Observable<IListResponse<IProposel>> {
    return this.get<IListResponse<IProposel>>(this.route, params);
  }
  getById(id: string) {
    return this.httpClient.get(`${this.route}/${id}`);
  }
}
