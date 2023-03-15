import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService
  ) {}

  getGoodAppointmentDepositaryByNoGood(params: ListParams) {
    return this.msDepositaryService.getGoodAppointmentDepositaryByNoGood(
      params
    );
  }

  getGoodByNoGoodAndStatus(params: ListParams) {
    return this.msGoodService.getAll(params);
  }
}
