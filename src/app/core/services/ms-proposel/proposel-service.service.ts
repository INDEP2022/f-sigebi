import { Injectable } from '@angular/core';
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
    this.microservice = ProposelEndpoint.BasePath;
  }

  getAll(params?: ListParams) {
    return this.get<IListResponse<IProposel>>(this.route, params);
  }
  getIdPropose(params?: ListParams, id?: any) {
    return this.get(`${this.route}?filter.ID_PROPUESTA=$eq:${id}`, params);
  }
}
