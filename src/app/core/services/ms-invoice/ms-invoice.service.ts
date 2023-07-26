import { Injectable } from '@angular/core';
import { ENDPOINT_INVOICE } from 'src/app/common/constants/endpoints/ms-invoice-endpoint';
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

  getComerHeadboard(params?: string){
    return this.get(`comer-headboard`,params)
  }
}
