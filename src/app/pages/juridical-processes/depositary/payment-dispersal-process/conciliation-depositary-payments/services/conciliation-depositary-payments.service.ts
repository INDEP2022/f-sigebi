import { Injectable } from '@angular/core';
import { IPaymendtDepParamsDep } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class ConciliationDepositaryPaymentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msMsDepositaryPaymentService: MsDepositaryPaymentService
  ) {}

  getGoodAppointmentDepositaryByNoGood(params: string) {
    return this.msDepositaryService.getGoodAppointmentDepositaryByNoGood(
      params
    );
  }
  getGoodDataByFilter(body: string) {
    return this.msGoodService.getAllFilter(body);
  }
  getPaymentsGensDepositories(params: string) {
    return this.msMsDepositaryPaymentService.getPaymentsGensDepositories(
      params
    );
  }
  getPersonsModDepositary(params: string) {
    return this.msDepositaryService.getPersonsModDepositary(params);
  }
  getPaymentRefParamsDep(params: IPaymendtDepParamsDep) {
    return this.msDepositaryService.getPaymentRefParamsDep(params);
  }
  getPaymentRefValidDep(params: any) {
    return this.msDepositaryService.getPaymentRefValidDep(params);
  }
}
