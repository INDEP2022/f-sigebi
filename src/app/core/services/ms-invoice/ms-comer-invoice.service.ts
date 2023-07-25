import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ComerInovice } from '../../models/ms-invoice/comer-invoice.model';

@Injectable({
  providedIn: 'root',
})
export class ComerInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getAll(params: _Params | string) {
    return this.get<IListResponse<ComerInovice>>(
      ENDPOINT_INVOICE.ComerInovice,
      params
    );
  }

  getPenalizeData(idEvent: number, idLote: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationImpPenalize}?idEvent=${idEvent}&idLot=${idLote}`
    );
  }
}
