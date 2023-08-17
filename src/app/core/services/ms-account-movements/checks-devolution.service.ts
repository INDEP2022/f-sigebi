import { Injectable } from '@angular/core';
import { AccountmvmntEndpoint } from 'src/app/common/constants/endpoints/accountmvmnt-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IUserChecks } from '../../models/ms-account-movements/account-movement.model';

@Injectable({
  providedIn: 'root',
})
export class ChecksDevolutionService extends HttpService {
  constructor() {
    super();
    this.microservice = AccountmvmntEndpoint.BasePath;
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IUserChecks>>('user-checks', params);
  }

  getAllFilterSelf(self?: ChecksDevolutionService, params?: _Params) {
    return self.get<IListResponseMessage<IUserChecks>>('user-checks', params);
  }

  updateUserChecks(id: number, body: any) {
    return this.put('user-checks/' + id, body);
  }

  createUserChecks(body: IUserChecks) {
    return this.post('user-checks', body);
  }
}
