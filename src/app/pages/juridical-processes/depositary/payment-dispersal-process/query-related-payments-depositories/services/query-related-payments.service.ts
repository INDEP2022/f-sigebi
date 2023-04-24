import { Injectable } from '@angular/core';
import { ISendSirSaeBody } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';

@Injectable({
  providedIn: 'root',
})
export class QueryRelatedPaymentsService {
  constructor(
    private msMsDepositaryPaymentService: MsDepositaryPaymentService,
    private msDepositaryService: MsDepositaryService
  ) {}

  sendSirsae(params: ISendSirSaeBody) {
    return this.msMsDepositaryPaymentService.sendSirsae(params);
  }
}
