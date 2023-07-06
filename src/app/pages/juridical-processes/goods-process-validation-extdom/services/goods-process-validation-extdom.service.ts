import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';

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
    private msDelegationService: DelegationService,
    private msParametersService: ParametersService,
    private msStateOfRepublicService: StateOfRepublicService,
    private msCityService: CityService,
    private msTransferenteService: TransferenteService,
    private msStationService: StationService,
    private msAuthorityService: AuthorityService
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
  faStageCreda(dateCreate: string) {
    return this.msParametersService.getFaStageCreda(dateCreate);
  }
  getStateOfRepublic(params: ListParams) {
    return this.msStateOfRepublicService.getAll(params);
  }
  getCity(params: ListParams) {
    return this.msCityService.getAllCitys(params);
  }
  getTransferente(params: ListParams) {
    return this.msTransferenteService.getAll(params);
  }
  getStation(params: ListParams) {
    return this.msStationService.getAll(params);
  }
  getAuthority(params: ListParams) {
    return this.msAuthorityService.getAll(params);
  }
}
