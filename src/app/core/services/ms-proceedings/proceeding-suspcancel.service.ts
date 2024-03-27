import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProceedingSusPcancelService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.MaximunClosingTime;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.proceedingsuspcancel;
  }

  suspcancel(user: any) {
    const route = `${ProceedingsEndpoints.suspCancel}?filter.status=$ilike:XXX&filter.regusr=$ilike:${user}`;
    return this.get(route);
  }

  tmpValGoodConst(params: any) {
    return this.get('tmp-val-goodconst', params);
  }

  queryTransferKey(body: { proceedingsNumber: string; typeMinutes: string }) {
    return this.post('application/query-transfer-key', body);
  }

  queryRNomencla(delegation: string, params?: any) {
    return this.get(`application/query-r-nomencla/${delegation}`, params);
  }
}
