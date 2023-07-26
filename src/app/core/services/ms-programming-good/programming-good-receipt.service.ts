import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IReceiptItem } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingGoodReceiptService extends HttpService {
  constructor() {
    super();
    this.microservice = 'programminggood';
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IReceiptItem>>(
      'programmed-good/getRowNum',
      params
    );
  }
}
