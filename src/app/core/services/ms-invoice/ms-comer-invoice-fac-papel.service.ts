import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerInvoiceFacPapelService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getAll(params: _Params | string) {
    return this.get<IListResponse<any>>(ENDPOINT_INVOICE.ComerFacPapel, params);
  }

  create(data: any) {
    return this.post(ENDPOINT_INVOICE.ComerFacPapel, data);
  }

  update(data: any) {
    return this.put(ENDPOINT_INVOICE.ComerFacPapel, data);
  }

  remove(data: any) {
    return this.put(ENDPOINT_INVOICE.ComerFacPapel, data);
  }
}
