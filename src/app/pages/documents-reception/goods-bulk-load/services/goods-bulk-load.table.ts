import { Injectable } from '@angular/core';
//httpClient
import { HttpClient } from '@angular/common/http';
//params
//services
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';

@Injectable({
  providedIn: 'root',
})
export class GoodsBulkLoadService {
  constructor(
    private httClient: HttpClient,
    private goodService: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private goodsQueryService: GoodsQueryService,
    private authorityService: AuthorityService,
    private issuingInstitutionService: IssuingInstitutionService,
    private expedientService: ExpedientService
  ) {}

  /**
   * FUNCIONES PARA VALIDAR LOS ARCHIVOS
   */

  getGoodStatus(idEstatus: string) {
    return this.goodService.getByStatus(idEstatus);
  }

  getGoodssSubtype(params: ListParams) {
    return this.goodSssubtypeService.getAll(params);
  }

  getUnityByUnityAndClasifGood(clasifNum: number) {
    return this.goodsQueryService.getClasifXUnitByClasifNum(clasifNum);
  }
  getNumberTransferenteAuthority(params: ListParams) {
    return this.authorityService.getAll(params);
  }
  getAtributeClassificationGood(params: ListParams) {
    return this.goodsQueryService.getAtributeClassificationGood(params);
  }

  /**
   * FUNCIONES DE CARGA DE ARCHIVOS
   */

  getGoodById(idGood: string) {
    return this.goodService.getById(idGood);
  }

  searchForSatOnlyKey(params: ListParams) {}
  searchCityByDescripction(params: ListParams) {}

  getIssuingInstitutionById(idInstitution: string) {
    return this.issuingInstitutionService.getById(idInstitution);
  }
  getEntityFederativeByAsuntoSat(asuntoSat: string) {
    return this.issuingInstitutionService.getById(asuntoSat);
  }
  getExpedientById(idExpedient: string) {
    return this.expedientService.getById(idExpedient);
  }
}
