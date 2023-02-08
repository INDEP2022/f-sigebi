import { Injectable } from '@angular/core';
//httpClient
import { HttpClient } from '@angular/common/http';
//params
//services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';

@Injectable({
  providedIn: 'root',
})
export class GoodsBulkLoadService {
  constructor(
    private httClient: HttpClient,
    private satInterfaceService: SatInterfaceService,
    private delegationService: DelegationService,
    private goodService: GoodService
  ) {}

  getGoodStatus(idEstatus: string) {
    return this.goodService.getStatusByGood(idEstatus);
  }
}
