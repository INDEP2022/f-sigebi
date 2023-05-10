import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodsSubtypeService } from 'src/app/core/services/catalogs/goods-subtype.service';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';

@Injectable({
  providedIn: 'root',
})
export class GoodsDepositaryService {
  constructor(
    private msDelegationService: DelegationService,
    private msSubdelegationService: SubdelegationService,
    private msPersonService: PersonService,
    private msStateOfRepublicService: StateOfRepublicService,
    private msGoodTypeService: GoodTypeService,
    private msGoodsSubtypeService: GoodsSubtypeService
  ) {}

  getDelegations(params: ListParams) {
    return this.msDelegationService.getAll(params);
  }

  getSubDelegations(params: ListParams) {
    return this.msSubdelegationService.getAll(params);
  }

  getDepositary(params: ListParams) {
    return this.msPersonService.getAll(params);
  }

  getFederativeEntity(params: ListParams) {
    return this.msStateOfRepublicService.getAll(params);
  }

  getGoodType(params: ListParams) {
    return this.msGoodTypeService.getAll(params);
  }

  getSubTypeGood(params: ListParams) {
    return this.msGoodsSubtypeService.getAll(params);
  }
}
