import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositaryPaymentEndPoints } from 'src/app/common/constants/endpoints/ms-depositarypayment-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IPaymentsGensDepositary,
  IRefPayDepositary,
  IResponseSirsaeFunction,
  ISendSirSaeBody,
  ITotalAmountRefPayments,
  ITotalAmountRefPaymentsResponse,
  ITotalIvaPaymentsGens,
  ITotalIvaPaymentsGensResponse,
} from '../../models/ms-depositarypayment/ms-depositarypayment.interface';

@Injectable({
  providedIn: 'root',
})
export class MsDepositaryPaymentService extends HttpService {
  constructor() {
    super();
    this.microservice = DepositaryPaymentEndPoints.DepositaryPayment;
  }

  getRefPayDepositories(
    params?: string
  ): Observable<IListResponse<IRefPayDepositary>> {
    return this.get<IListResponse<IRefPayDepositary>>(
      `${DepositaryPaymentEndPoints.RefPayDepositories}?${params}`
    );
  }

  getPaymentsGensDepositories(
    params?: string
  ): Observable<IListResponse<IPaymentsGensDepositary>> {
    return this.get<IListResponse<IPaymentsGensDepositary>>(
      `${DepositaryPaymentEndPoints.PaymentsGensDepositories}?${params}`
    );
  }

  sendSirsae(
    params?: ISendSirSaeBody
  ): Observable<IListResponse<IResponseSirsaeFunction>> {
    return this.post<IListResponse<IResponseSirsaeFunction>>(
      DepositaryPaymentEndPoints.ApplicationSendSirsae,
      params
    );
  }

  getPaymentsGensDepositoriesTotals(
    params?: ITotalIvaPaymentsGens
  ): Observable<IListResponse<ITotalIvaPaymentsGensResponse>> {
    return this.post<IListResponse<ITotalIvaPaymentsGensResponse>>(
      DepositaryPaymentEndPoints.PaymentsGensDepositoriesTotals,
      params
    );
  }

  getRefPayDepositoriesTotals(
    params?: ITotalAmountRefPayments
  ): Observable<IListResponse<ITotalAmountRefPaymentsResponse>> {
    return this.post<IListResponse<ITotalAmountRefPaymentsResponse>>(
      DepositaryPaymentEndPoints.RefPayDepositoriesTotals,
      params
    );
  }
}
