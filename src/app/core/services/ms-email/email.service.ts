import { Injectable } from '@angular/core';
import { EmailEndPoint } from 'src/app/common/constants/endpoints/ms-email-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IVigEmailBody,
  IVigEmailSend,
  IVigMailBook,
} from '../../models/ms-email/email-model';
@Injectable({
  providedIn: 'root',
})
export class EmailService extends HttpService {
  constructor() {
    super();
    this.microservice = EmailEndPoint.BasePath;
  }

  sendEmail(model: Object) {
    return this.post(EmailEndPoint.Email, model);
  }

  getVigEmailBody() {
    return this.get<IListResponse<IVigEmailBody>>(EmailEndPoint.VigEmailBody);
  }

  getVigEmailSend(params: _Params) {
    return this.get<IListResponse<IVigEmailSend>>(
      EmailEndPoint.VigEmailSend,
      params
    );
  }

  getVigMailBook(params: _Params) {
    return this.get<IListResponse<IVigMailBook>>(
      EmailEndPoint.VigMailBook,
      params
    );
  }

  createEmailBook(form: Omit<IVigMailBook, 'id'>) {
    return this.post(EmailEndPoint.VigMailBook, form);
  }

  updateEmailBook(id: any, form: Omit<IVigMailBook, 'id'>) {
    return this.put(`${EmailEndPoint.VigMailBook}/${id}`, form);
  }

  deleteEmailBook(id: any) {
    return this.delete(`${EmailEndPoint.VigMailBook}/${id}`);
  }
}
