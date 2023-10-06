import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ParameterComerEndpoints } from 'src/app/common/constants/endpoints/ms-parametercomer-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import {
  IParameterChargeCSV,
  IParameterComerDTO,
} from '../models/parametercomer';
@Injectable({
  providedIn: 'root',
})
export class ExpenseParametercomerService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
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

  pupChargeValidateGoods(file: File, body: IParameterChargeCSV) {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conceptId', `${body.conceptId}`);
    formData.append('amount2', `${body.amount2}`);
    formData.append('iva2', `${body.iva2}`);
    formData.append('retentionISR', `${body.retentionISR}`);
    formData.append('retentionIva2', `${body.retentionIva2}`);
    const request = new HttpRequest(
      'POST',
      `${this._url}${this.microservice}/${this._prefix}${ParameterComerEndpoints.ChargeValidateGoods}`,
      formData
    );
    return this.httpClient.request(request).pipe(
      catchError(error => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  pupChargeGoods(file: File) {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(
      `${this._url}${this.microservice}/${this._prefix}${ParameterComerEndpoints.ChargeGoods}`,
      formData
    );
  }

  postComerParametersMod(body: any) {
    return this.post(ParameterComerEndpoints.GetvValue, body);
  }

  postParametersMod(body: any) {
    return this.post(ParameterComerEndpoints.ParameterMod, body);
  }

  deleteParametersMod(body: any) {
    return this.delete(ParameterComerEndpoints.ParameterMod, body);
  }

  getParameterModParam(params?: ListParams) {
    return this.get(`${ParameterComerEndpoints.ParameterMod}`, params);
  }
}
