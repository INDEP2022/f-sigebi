import { Injectable } from '@angular/core';
//httpClient
import { HttpClient } from '@angular/common/http';
//params
//services
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAuthorityIssuingParams } from 'src/app/core/models/catalogs/authority.model';
import { IDinamicQueryParams } from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';

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
    private expedientService: ExpedientService,
    private satInterfaceService: SatInterfaceService
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

  /**
   * Obtener el bien de acuerdo el id del bien
   * @param idGood Id del bien
   * @returns
   */
  getGoodById(idGood: string) {
    return this.goodService.getById(idGood);
  }

  getSatKey(params: IDinamicQueryParams) {
    return this.satInterfaceService.getSatTransfer(params);
  }

  /**
   * Obtener la clave de la ciudad apartir de la clave Asunto SAT
   * @param asuntoSat Clave de Asunto SAT
   */
  searchCityByAsuntoSat(asuntoSat: string) {
    return this.authorityService.getCityByAsuntoSat(asuntoSat);
  }

  getIssuingInstitutionById(idInstitution: string) {
    return this.authorityService.getById(idInstitution);
  }
  /**
   * Obtener la emisora y la autoridad de acuerdo a los parametros enviados
   * @param params Parametros de tipo @IAuthorityIssuingParams
   * @returns
   */
  getIssuingInstitutionByParams(params: IAuthorityIssuingParams) {
    return this.authorityService.getAuthorityIssuingByParams(params);
  }
  /**
   * Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
   * @param asuntoSat Clave de Asunto SAT
   */
  getEntityFederativeByAsuntoSat(asuntoSat: string) {
    return this.issuingInstitutionService.getOTClaveEntityFederativeByAsuntoSat(
      asuntoSat
    );
  }
  getExpedientById(idExpedient: string) {
    return this.expedientService.getById(idExpedient);
  }
}
