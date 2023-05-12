import { Injectable } from '@angular/core';
import { IPaymendtDepParamsDep } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';

@Injectable({
  providedIn: 'root',
})
export class ConciliationDepositaryPaymentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msMsDepositaryPaymentService: MsDepositaryPaymentService,
    private msGoodprocessService: GoodprocessService
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
  getPaymentRefPrepOI(params: any) {
    return this.msDepositaryService.getPaymentRefPrepOI(params);
  }
  getValidStatusProcess(params: number) {
    return this.msGoodprocessService.getById(params);
  }
  getValidBlackListProcess(params: number) {
    return this.msDepositaryService.getValidBlackListAppointment(params);
  }
}
