import { Injectable } from '@angular/core';
import { ReceptionGoodEndpoint } from 'src/app/common/constants/endpoints/ms-reception-good-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReceptionTicketsInService extends HttpService {
  constructor() {
    super();
    this.microservice = ReceptionGoodEndpoint.BasePath;
  }

  getAll(params: { idProgramacion: string; params: _Params }) {
    return this.get<IListResponseMessage<any>>(
      ReceptionGoodEndpoint.QueryAllTicketsInt + '/' + params.idProgramacion,
      params.params
    );
  }
}
