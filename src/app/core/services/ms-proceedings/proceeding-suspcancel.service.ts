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
}
