import { Injectable } from '@angular/core';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IParameterComerDTO } from '../models/parametercomer';

@Injectable({
  providedIn: 'root',
})
export class ExpenseParametercomerService extends HttpService {
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getValidGoods(body: IParameterComerDTO) {
    return this.post('aplication/get-bienes-validados', body);
  }

  getParameterMod() {
    return this.get(
      `${ParameterComerEndpoints.ParameterMod}?limit=0&filter.parameter=$eq:IVA`
    );
  }

  getComerStatusVta(statusVta: string) {
    return this.get(
      `${ParameterComerEndpoints.ComerStatusVta}?filter.salesStatusId=$eq:${statusVta}`
    );
  }

  getComerParameterMod(
    idEvent: number,
    address: string,
    tpsolavalId: any,
    parameter: string
  ) {
    return this.get(
      `${ParameterComerEndpoints.ParameterMod}?filter.typeEventId=$eq:${idEvent}&filter.address=$eq:${address}&filter.value=$eq:${tpsolavalId}&filter.parameter=$eq:${parameter}`
    );
  }

  postComerParametersMod(body: any) {
    return this.post(ParameterComerEndpoints.GetvValue, body);
  }
}
