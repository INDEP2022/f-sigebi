import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IDescriptionByNoGoodBody,
  IFromGoodsAndExpedientsBody,
} from 'src/app/core/models/good/good.model';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msExpedientService: ExpedientService
  ) {}

  getGoodAppointmentDepositaryByNoGood(params: ListParams) {
    return this.msDepositaryService.getGoodAppointmentDepositaryByNoGood(
      params
    );
  }

  getGoodByParams(params: ListParams) {
    return this.msGoodService.getAll(params);
  }

  getDescriptionGoodByNoGood(body: IDescriptionByNoGoodBody) {
    return this.msGoodService.getDescriptionGoodByNoGood(body);
  }

  getStatusAndDescriptionGoodByNoGood(noGood: string | number) {
    return this.msGoodService.getGoodAndDesc(noGood);
  }

  getExpedientByNoExpedient(noExpedient: string | number) {
    return this.msExpedientService.getById(noExpedient);
  }

  getFromGoodsAndExpedients(body: IFromGoodsAndExpedientsBody) {
    return this.msGoodService.getFromGoodsAndExpedients(body);
  }
}
