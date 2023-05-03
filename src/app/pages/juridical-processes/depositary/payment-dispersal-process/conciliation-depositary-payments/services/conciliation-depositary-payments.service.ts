import { Injectable } from '@angular/core';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class ConciliationDepositaryPaymentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService
  ) {}

  getGoodAppointmentDepositaryByNoGood(params: string) {
    return this.msDepositaryService.getGoodAppointmentDepositaryByNoGood(
      params
    );
  }
  getGoodDataByFilter(body: string) {
    return this.msGoodService.getAllFilter(body);
  }
}
