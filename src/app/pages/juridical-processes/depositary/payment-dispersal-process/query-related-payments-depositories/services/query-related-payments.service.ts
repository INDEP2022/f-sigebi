import { Injectable } from '@angular/core';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import {
  ISendSirSaeBody,
  ITotalAmountRefPayments,
  ITotalIvaPaymentsGens,
} from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class QueryRelatedPaymentsService {
  constructor(
    private msMsDepositaryPaymentService: MsDepositaryPaymentService,
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService
  ) {}

  sendSirsae(params: ISendSirSaeBody) {
    return this.msMsDepositaryPaymentService.sendSirsae(params);
  }
  getGoodAppointmentDepositaryByNoGood(params: string) {
    return this.msDepositaryService.getGoodAppointmentDepositaryByNoGood(
      params
    );
  }
  getGoodDataByFilter(body: string) {
    return this.msGoodService.getAllFilter(body);
  }
  getDescriptionGoodByNoGood(body: IDescriptionByNoGoodBody) {
    return this.msGoodService.getDescriptionGoodByNoGood(body);
  }
  getRefPayDepositories(params: string) {
    return this.msMsDepositaryPaymentService.getRefPayDepositories(params);
  }
  getPaymentsGensDepositories(params: string) {
    return this.msMsDepositaryPaymentService.getPaymentsGensDepositories(
      params
    );
  }
  getPaymentsGensDepositoriesTotals(params: ITotalIvaPaymentsGens) {
    return this.msMsDepositaryPaymentService.getPaymentsGensDepositoriesTotals(
      params
    );
  }
  getRefPayDepositoriesTotals(params: ITotalAmountRefPayments) {
    return this.msMsDepositaryPaymentService.getRefPayDepositoriesTotals(
      params
    );
  }
}
