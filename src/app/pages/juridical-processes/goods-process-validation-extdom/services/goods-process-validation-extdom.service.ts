import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class GoodsProcessValidationExtdomService {
  constructor(
    private msNotificationService: NotificationService,
    private msAffairService: AffairService,
    private msIndiciadosService: IndiciadosService,
    private msMinPubService: MinPubService,
    private msCourtService: CourtService,
    private msDelegationService: DelegationService
  ) {}
  getNotificationByFilters(params: _Params) {
    return this.msNotificationService.getAllFilter(params);
  }
  getAffair(params: ListParams) {
    return this.msAffairService.getAll(params);
  }
  getIndiciados(params: ListParams) {
    return this.msIndiciadosService.getAllFiltered(params);
  }
  getMinpub(params: string) {
    return this.msMinPubService.getAllWithFilters(params);
  }
  getCourt(params: ListParams) {
    return this.msCourtService.getAll(params);
  }
  getDelegation(params: ListParams) {
    return this.msDelegationService.getAllPaginated(params);
  }
}
