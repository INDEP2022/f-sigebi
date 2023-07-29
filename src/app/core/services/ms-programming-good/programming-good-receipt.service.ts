import { Injectable } from '@angular/core';
import { ProgrammingGoodEndpoints } from 'src/app/common/constants/endpoints/ms-programming-good-enpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IProgramingReception,
  IprogrammingDelivery,
  IReceiptItem,
  IUpdateDateProgramingReceptionDTO,
  IUpdateGoodDTO,
} from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { environment } from 'src/environments/environment';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingGoodReceiptService extends HttpService {
  constructor() {
    super();
    this.microservice = ProgrammingGoodEndpoints.BasePath;
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IReceiptItem>>(
      'programmed-good/getRowNum',
      params
    );
  }

  getReceptions(params: _Params) {
    return this.get<IListResponseMessage<IProgramingReception>>(
      ProgrammingGoodEndpoints.GetReceptions,
      params
    );
  }

  getDeliverys(params: _Params) {
    return this.get<IListResponseMessage<IprogrammingDelivery>>(
      ProgrammingGoodEndpoints.GetDeliverys,
      params
    );
  }

  updateDescBien(body: IUpdateGoodDTO) {
    return this.post(ProgrammingGoodEndpoints.UpdateDescBien, body);
  }

  updateDateProgramingReception(body: IUpdateDateProgramingReceptionDTO) {
    return this.post(
      ProgrammingGoodEndpoints.UpdateDateProgramingReception,
      body
    );
  }

  updateDateProgramingDelivery(body: IUpdateDateProgramingReceptionDTO) {
    return this.post(
      ProgrammingGoodEndpoints.UpdateDateProgramingDelivery,
      body
    );
  }

  postGoodsProgramingReceipts(data: any) {
    return this.post('programminggood/apps/goods-programming-receipts', data);
  }
  create(data: any) {
    const route = `${environment.API_URL}catalog/api/v1/apps/getProgrammingGoodsIn`;
    return this.httpClient.post(route, data);
  }
}
