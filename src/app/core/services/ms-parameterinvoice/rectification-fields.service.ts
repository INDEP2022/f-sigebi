import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ParameterInvoiceEndpoint } from 'src/app/common/constants/endpoints/parameterinvoice-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class RectifitationFieldsService extends HttpService {
  constructor() {
    super();
    this.microservice = ParameterInvoiceEndpoint.BasePath;
  }

  getAll(params: Params | string): Observable<IListResponse<any>> {
    return this.get(ParameterInvoiceEndpoint.RectificationFields, params);
  }

  create(data: any) {
    return this.post(ParameterInvoiceEndpoint.RectificationFields, data);
  }

  update(data: any) {
    return this.put(`${ParameterInvoiceEndpoint.RectificationFields}`, data);
  }

  remove(data: { columnId: string; invoiceFieldId: string; table: string }) {
    return this.delete(ParameterInvoiceEndpoint.RectificationFields, data);
  }

  getAllFieldValid(params: Params | string) {
    return this.get(ParameterInvoiceEndpoint.FieldValid, params);
  }
}
