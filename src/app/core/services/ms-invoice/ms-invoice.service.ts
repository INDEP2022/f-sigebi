import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MsInvoiceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_INVOICE.BasePath;
  }

  getByNoInvoice(invoice: string | number) {
    return this.get<IListResponse>(
      `${ENDPOINT_INVOICE.straInvoice}?filter.billId=$eq:${invoice}`
    );
  }

  getComerHeadboard(params?: string) {
    return this.get(`comer-headboard`, params);
  }

  getGetGegrafica(body: any, params?: ListParams) {
    return this.post(ENDPOINT_INVOICE.GetGegraficaFacturas, body, params);
  }

  VALIDA_PAGOSREF_OBT_PARAMETROS(id: any) {
    // VALIDA_PAGOSREF.OBT_PARAMETROS
    return this.get(`ctrl-invoice/obt-parameters/${id}`);
  }
}
