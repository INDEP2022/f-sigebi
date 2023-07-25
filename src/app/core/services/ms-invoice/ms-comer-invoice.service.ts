import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ComerInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getAll(params: _Params | string) {
    return this.get<IListResponse<any>>(ENDPOINT_INVOICE.ComerInovice, params);
  }

  create(data: any) {
    return this.post(ENDPOINT_INVOICE.ComerInovice, data);
  }

  getPenalizeData(idEvent: number, idLote: number) {
    return this.get(
      `${ENDPOINT_INVOICE.ApplicationImpPenalize}?idEvent=${idEvent}&idLot=${idLote}`
    );
  }

  getMaxFacturaId(idEvent: number) {
    return this.get(`${ENDPOINT_INVOICE.ApplicationMaxFolio}/${idEvent}`);
  }

  deleteFolio(data: { eventId: string; invoiceId: string }) {
    return this.post(ENDPOINT_INVOICE.DeleteFolio, data);
  }

  updateStatusImg(data: {
    pStatus: string;
    pProcess: string;
    pEvent: number;
    idFact: number;
  }) {
    return this.put(ENDPOINT_INVOICE.UpdateStatusImg, data);
  }
}
