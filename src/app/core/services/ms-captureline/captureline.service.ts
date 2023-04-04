import { Injectable } from '@angular/core';
import { CapturelineEndpoints } from 'src/app/common/constants/endpoints/ms-captureline';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { TmpLcComer } from '../../models/ms-captureline/captureline';

@Injectable({
  providedIn: 'root',
})
export class CapturelineService extends HttpService {
  private readonly route = CapturelineEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Captureline;
  }

  getTmpLcComer(params?: _Params) {
    return this.get<TmpLcComer>(this.route.TmpLcComer, params);
  }

  getComerRefWarranties(params?: _Params) {
    return this.get<TmpLcComer>(this.route.ComerRefWarranties, params);
  }
}
