import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msExpedientService: ExpedientService,
    private msGoodsInvService: GoodsInvService,
    private msStateOfRepublicService: StateOfRepublicService
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

  getFromGoodsAndExpedients(body: string) {
    return this.msGoodService.getAllFilter(body);
  }

  /**
   * DATA SELECTS
   */
  getDelegationsByFilter(params: string) {
    return this.msGoodsInvService.getAllMunipalitiesByFilter(params);
  }
  getLocalityByFilter(params: string) {
    return this.msGoodsInvService.getAllTownshipByFilter(params);
  }
  getStateOfRepublic(
    params: ListParams,
    stateId: boolean,
    idState: number | string = ''
  ) {
    if (stateId) {
      return this.msStateOfRepublicService.getById(idState);
    } else {
      return this.msStateOfRepublicService.getAll(params);
    }
  }
  /**
   * HELP FUNCTIONS FOR COMPONENT
   */

  getPersonType(personType: String) {
    if (personType == 'F') {
      return 'FÍSICA';
    } else if (personType == 'M') {
      return 'MORAL';
    } else {
      return personType;
    }
  }

  getResponsibleType(personType: String) {
    if (personType == 'A') {
      return 'ADMINISTRADOR';
    } else if (personType == 'D') {
      return 'DEPOSITARIA';
    } else if (personType == 'I') {
      return 'INTERVENTOR';
    } else if (personType == 'O') {
      return 'OTRO';
    } else if (personType == 'C') {
      return 'CUSTODIO';
    } else {
      return personType;
    }
  }
}
