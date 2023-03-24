import { Injectable } from '@angular/core';
//httpClient
import { HttpClient } from '@angular/common/http';
//params
//services
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IAuthorityIssuingParams } from 'src/app/core/models/catalogs/authority.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { ITagXClasif } from 'src/app/core/models/ms-classifygood/ms-classifygood.interface';
import {
  IDinamicQueryParams,
  ISatTransfer,
} from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
import { IMassiveGood } from 'src/app/core/models/ms-massivegood/massivegood.model';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { INotificationTransferentIndiciadoCityGetData } from 'src/app/core/models/ms-notification/notification.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { IndicatorDeadlineService } from 'src/app/core/services/catalogs/indicator-deadline.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { SatTransferService } from 'src/app/core/services/ms-interfacesat/sat-transfer.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
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
    private satInterfaceService: SatInterfaceService,
    private notificationService: NotificationService,
    private indicatorDeadlineService: IndicatorDeadlineService,
    private classifyGoodService: ClassifyGoodService,
    private massiveGoodService: MassiveGoodService,
    private historyGoodService: HistoryGoodService,
    private satTransferService: SatTransferService,
    private interfacefgrService: InterfacefgrService,
    private menageService: MenageService
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
  searchCityByAsuntoSat(asuntoSat: string, opcion: string = 'sat') {
    if (opcion == 'sat') {
      return this.authorityService.getCityByAsuntoSat(asuntoSat);
    } else {
      return this.interfacefgrService.getCityByAsuntoSat({
        pgrOffice: asuntoSat,
      });
    }
  }

  getDataPGRFromParams(params: string) {
    return this.interfacefgrService.getPgrTransferFiltered(params);
  }

  /**
   * Obtener las notificaciones de acuerdo al transferente, indiciado y la ciudad
   */
  getNotificacionesByTransferentIndiciadoCity(
    body: INotificationTransferentIndiciadoCityGetData | any
  ) {
    return this.notificationService.getNotificacionesByTransferentIndiciadoCity(
      body
    );
  }

  /**
   * Obtener notificaciones por volante
   */
  getGetNotificacionByVolante(params: ListParams) {
    return this.notificationService.getAll(params);
  }

  getVolanteNotificacionesByNoExpedient(noExpediente: string) {
    return this.notificationService.getVolanteNotificacionesByNoExpedient(
      noExpediente
    );
  }

  getIssuingInstitutionById(idInstitution: string) {
    return this.authorityService.getById(idInstitution);
  }
  /**
   * Obtener la emisora y la autoridad de acuerdo a los parametros enviados
   * @param params Parametros de tipo @IAuthorityIssuingParams
   * @returns
   */
  getIssuingInstitutionByParams(
    params: IAuthorityIssuingParams,
    opcion: string = 'sat'
  ) {
    if (opcion == 'sat') {
      return this.authorityService.getAuthorityIssuingByParams(params);
    } else {
      return this.authorityService.getAuthorityIssuingByAverPrevia(params);
    }
  }

  getEmisoraAutoridadTransferente(params: ListParams) {
    return this.authorityService.getAll(params);
  }
  /**
   * Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
   * @param asuntoSat Clave de Asunto SAT
   */
  getEntityFederativeByAsuntoSat(asuntoSat: string, opcion: string = 'sat') {
    if (opcion == 'sat') {
      return this.issuingInstitutionService.getOTClaveEntityFederativeByAsuntoSat(
        asuntoSat
      );
    } else {
      return this.issuingInstitutionService.getOTClaveEntityFederativeByAvePrevia(
        asuntoSat
      );
    }
  }
  getExpedientById(idExpedient: string) {
    return this.expedientService.getById(idExpedient);
  }
  createExpedient(expedient: any) {
    return this.expedientService.create(expedient);
  }
  getIndicatorById(idIndicator: string) {
    return this.indicatorDeadlineService.getById(idIndicator);
  }
  createGood(good: IGood) {
    return this.goodService.create(good);
  }
  updateGood(id: string, good: IGood) {
    return this.goodService.update(id, good);
  }
  getUploadGoodIdentificador(id: number) {
    return this.massiveGoodService.countMassiveGood(id);
  }
  getTagXClasifByCol6Transfer(body: ITagXClasif) {
    return this.classifyGoodService.getTagXClassif(body);
  }
  createMassiveGood(body: IMassiveGood) {
    return this.massiveGoodService.create(body);
  }
  createHistoryGood(body: IHistoryGood) {
    return this.historyGoodService.create(body);
  }
  updateSatTransferencia(id: string | number, body: ISatTransfer) {
    return this.satTransferService.update(id, body);
  }
  getSatTransferencia(cveSat: string) {
    return this.satTransferService.getById(cveSat);
  }
  createMenaje(menaje: IMenageWrite) {
    return this.menageService.create(menaje);
  }

  getZStatusCatPhasePart(status: string) {
    return this.goodsQueryService.getZStatusCatPhasePart(status);
  }
}
