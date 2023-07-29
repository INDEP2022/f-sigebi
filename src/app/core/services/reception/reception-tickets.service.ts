import { Injectable } from '@angular/core';
import { ReceptionGoodEndpoint } from 'src/app/common/constants/endpoints/ms-reception-good-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReceptionTicketsService extends HttpService {
  constructor() {
    super();
    this.microservice = ReceptionGoodEndpoint.BasePath;
  }

  getAll(params: { folio: string; params: _Params }) {
    return this.get<IListResponseMessage<any>>(
      ReceptionGoodEndpoint.ReceiptTickets + '/' + params.folio,
      params.params
    );
  }
}
