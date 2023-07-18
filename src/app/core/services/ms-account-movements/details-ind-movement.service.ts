import { Injectable } from '@angular/core';
import { AccountmvmntEndpoint } from 'src/app/common/constants/endpoints/accountmvmnt-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAccountDetailInd } from '../../models/ms-account-movements/account-detail-ind';

@Injectable({
  providedIn: 'root',
})
export class DetailsIndMovementService extends HttpService {
  constructor() {
    super();
    this.microservice = AccountmvmntEndpoint.BasePath;
  }
  getAll(
    params: _Params,
    body: { goodNumber: string; expedientNumber: number }
  ) {
    return this.post<IListResponse<IAccountDetailInd>>(
      AccountmvmntEndpoint.getDetailsInd,
      body,
      params
    );
  }

  getAllFilterSelf(self?: DetailsIndMovementService, params?: _Params) {
    return self.post<IListResponse<IAccountDetailInd>>(
      AccountmvmntEndpoint.getDetailsInd,
      {},
      params
    );
  }
}
