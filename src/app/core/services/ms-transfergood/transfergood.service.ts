import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { DetailNum } from 'src/app/pages/administrative-processes/numerary/regional-account-transference/regional-account-transference/detail.model';
import { TransfergoodEndpoint } from '../../../common/constants/endpoints/transfergood-endpoint';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Itransfergood } from '../../models/ms-transfergood/transfergood.model';

@Injectable({
  providedIn: 'root',
})
export class TranfergoodService extends HttpService {
  constructor() {
    super();
    this.microservice = TransfergoodEndpoint.BasePath;
  }

  getAllFilter(params?: ListParams | string) {
    return this.get<IListResponse<DetailNum>>(
      TransfergoodEndpoint.TransNumDetail,
      params
    );
  }

  create(data: any) {
    return this.post(TransfergoodEndpoint.TransNumDetail, data);
  }

  update(data: any) {
    return this.put(TransfergoodEndpoint.TransNumDetail, data);
  }

  remove(data: any) {
    return this.delete(TransfergoodEndpoint.TransNumDetail, data);
  }

  getFileCSV(formData: FormData) {
    return this.post<IListResponse<Itransfergood>>(
      `${TransfergoodEndpoint.getFileCSV}`,
      formData
    );
  }

  getMessageEmail(data: Object) {
    return this.post(TransfergoodEndpoint.EmailMessage, data);
  }

  sendEmail(data: Object) {
    return this.post(TransfergoodEndpoint.SendEmail, data);
  }

  getEmailCentral(data: Object) {
    return this.post(TransfergoodEndpoint.SendEmailCheque, data);
  }
}
