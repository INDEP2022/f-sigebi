import { Injectable } from '@angular/core';
import { InterfaceSirsaeEndpoints } from 'src/app/common/constants/endpoints/ms-interfacesirsae';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISirsaeStateAccountDetail } from '../../models/ms-interfacesirsae/interfacesirsae';

@Injectable({
  providedIn: 'root',
})
export class InterfacesirsaeService extends HttpService {
  private readonly route = InterfaceSirsaeEndpoints;
  constructor() {
    super();
    this.microservice = this.route.InterfaceSirsae;
  }

  getStatusesMov(params?: _Params) {
    return this.get<IListResponse<{ id: number; statusDescription: string }>>(
      this.route.StatusesMov,
      params
    );
  }

  getAccountDetail(params?: _Params) {
    return this.get<IListResponse<ISirsaeStateAccountDetail>>(
      this.route.AccountDetail,
      params
    );
  }
}
