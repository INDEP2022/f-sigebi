import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import {
  IScreenStatusCValRevocation,
  IScreenStatusCValUniversalFolio,
} from 'src/app/core/models/ms-screen-status/seg-app-screen.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { SegAppScreenService } from 'src/app/core/services/ms-screen-status/seg-app-screen.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(
    private msDepositaryService: MsDepositaryService,
    private msGoodService: GoodService,
    private msExpedientService: ExpedientService,
    private msGoodsInvService: GoodsInvService,
    private msStateOfRepublicService: StateOfRepublicService,
    private msSegAppScreenService: SegAppScreenService,
    private msNotificationService: NotificationService,
    private msPersonService: PersonService
  ) {}

  getDataDepositaryAppointment(params: ListParams) {
    return this.msDepositaryService.getAllFilteredFactJurRegDestLeg(params);
  }

  getGoodAppointmentDepositaryByNoGood(params: ListParams) {
    return this.msDepositaryService.getAllFiltered(params);
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
  getPostalCodeByFilter(params: string) {
    return this.msGoodsInvService.getAllCodePostalByFilter(params);
  }
  getLocalityByFilter(params: string) {
    return this.msGoodsInvService.getAllTownshipByFilter(params);
  }
  getDelegationsByFilter(params: string) {
    return this.msGoodsInvService.getAllMunipalitiesByFilter(params);
  }
  getStateOfRepublicByAll(params: ListParams) {
    return this.msStateOfRepublicService.getAll(params);
  }
  getStateOfRepublicById(idState: number | string = '') {
    return this.msStateOfRepublicService.getById(idState);
  }
  getCValFoUni(body: IScreenStatusCValUniversalFolio) {
    return this.msSegAppScreenService.cValFolUni(body);
  }
  getCValFoRev(body: IScreenStatusCValRevocation) {
    return this.msSegAppScreenService.cValFolRev(body);
  }
  getCFlyer(fileNumber: number) {
    return this.msNotificationService.getCFlyer(fileNumber);
  }
  getPerson(params: _Params) {
    return this.msPersonService.getAllFilters(params);
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
