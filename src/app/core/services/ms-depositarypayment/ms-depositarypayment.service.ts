import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositaryPaymentEndPoints } from 'src/app/common/constants/endpoints/ms-depositarypayment-endpoint copy';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISendSirSaeBody } from '../../models/ms-depositarypayment/ms-depositarypayment.interface';

@Injectable({
  providedIn: 'root',
})
export class MsDepositaryPaymentService extends HttpService {
  constructor() {
    super();
    this.microservice = DepositaryPaymentEndPoints.DepositaryPayment;
  }

  sendSirsae(params?: ISendSirSaeBody): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      DepositaryPaymentEndPoints.ApplicationSendSirsae,
      params
    );
  }
}
