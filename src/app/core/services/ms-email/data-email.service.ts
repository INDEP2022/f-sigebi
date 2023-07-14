import { Injectable } from '@angular/core';
import { EmailEndPoint } from 'src/app/common/constants/endpoints/ms-email-endpoint';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DataEmailService extends HttpService {
  constructor() {
    super();
    this.microservice = EmailEndPoint.BasePath;
  }

  create(body: Object) {
    return this.post(EmailEndPoint.DataEmail, body);
  }
}
