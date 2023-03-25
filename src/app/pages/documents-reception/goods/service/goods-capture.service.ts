import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { TypesByClasificationService } from 'src/app/core/services/catalogs/types-by-clasification.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodParameterService } from 'src/app/core/services/good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { TmpExpedientService } from 'src/app/core/services/ms-expedient/tmp-expedient.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService as _NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { TmpNotificationService } from 'src/app/core/services/ms-notification/tmp-notification.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';
export interface IRecord {
  id: string;
  dateAgreementAssurance?: any;
  foresight?: any;
  dateForesight?: any;
  articleValidated?: any;
  ministerialDate?: any;
  ministerialActOfFaith?: any;
  date_Dictamines?: any;
  batteryNumber?: any;
  lockerNumber?: any;
  shelfNumber?: any;
  courtNumber?: any;
  observationsForecast?: any;
  insertedBy: string;
  observations?: any;
  insertMethod: string;
  insertDate: Date;
  receptionDate?: any;
  criminalCase?: any;
  preliminaryInquiry?: any;
  protectionKey?: any;
  crimeKey?: any;
  circumstantialRecord?: any;
  keyPenalty?: any;
  nameInstitution: string;
  courtName?: any;
  mpName?: any;
  keySaveValue?: any;
  indicatedName: string;
  authorityOrdersDictum?: any;
  notificationDate?: any;
  notifiedTo?: any;
  placeNotification?: any;
  confiscateDictamineDate?: any;
  dictaminationReturnDate?: any;
  alienationDate?: any;
  federalEntityKey: string;
  dictaminationDate?: any;
  registerNumber: string;
  destructionDate?: any;
  donationDate?: any;
  initialAgreementDate?: any;
  initialAgreement?: any;
  expedientStatus?: any;
  identifier: string;
  crimeStatus?: any;
  transferNumber: string;
  expTransferNumber: string;
  expedientType: string;
  stationNumber: string;
  authorityNumber: string;
  insertionDatehc: Date;
}

export interface ICompensationGood {
  id: string;
  noType: string;
  descType: string;
  noSubtype: string;
  descSubtype: string;
  noSsubtype: string;
  descSsubtype: string;
  noSssubtype: string;
  descSssubtype: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoodsCaptureService {
  constructor(
    private httClient: HttpClient,
    private goodParametersService: GoodParameterService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private goodTypeService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private typesByClasificationService: TypesByClasificationService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private notificationService: NotificationService,
    private satInterfaceService: SatInterfaceService,
    private dynamicCatalogService: DynamicCatalogService,
    private goodsQueryService: GoodsQueryService,
    private goodLabelService: LabelOkeyService,
    private statusGoodService: StatusGoodService,
    private tmpExpedientService: TmpExpedientService,
    private interfaceFgrService: InterfacefgrService,
    private tpmNotificationService: TmpNotificationService,
    private _notificationService: _NotificationService
  ) {}

  getParamterById(id: string) {
    return this.goodParametersService.getById(id);
  }

  findExpedient(id: number) {
    return this.expedientService.getById(id);
  }

  getGoodsByRecordId(recordId: number) {
    return this.goodService.getGoodsByRecordId(recordId);
  }

  getTypeById(goodTypeId: number | string) {
    return this.goodTypeService.getById(goodTypeId);
  }

  getSubtypeById(id: number, idTypeGood: number) {
    return this.goodSubtypeService.getByIds({
      id,
      idTypeGood,
    });
  }

  getSsubtypeById(id: number, noSubType: number, noType: number) {
    const ids = { id, noSubType, noType };
    return this.goodSsubtypeService.getByIds(ids);
  }

  getSssubtypeById(
    id: number,
    numSsubType: number,
    numSubType: number,
    numType: number
  ) {
    const ids = { id, numSsubType, numSubType, numType };
    return this.goodSssubtypeService.getByIds(ids);
  }

  findById(recordId: number) {
    return this.httClient.get<IRecord>(
      `http://sigebimsqa.indep.gob.mx/expedient/api/v1/find-identificator/${recordId}`
    );
  }

  findGoodById(goodId: string | number) {
    return this.goodService.getById(goodId);
  }

  getTypesByClasification(clasificationId: number | string) {
    return this.typesByClasificationService.getById(clasificationId);
  }

  getMaxFlyerFromRecord(recordId: number | string) {
    return this.notificationService.getMaxFlyer(recordId);
  }

  getSatInterfaceCountByExpedient(body: any) {
    return this.satInterfaceService.getCountByExpedient(body);
  }

  getSatLengthByJobSubject(body: any) {
    return this.satInterfaceService.getLengthByJobSubject(body);
  }

  getCountByOffice(body: { officeKey: string }) {
    return this.satInterfaceService.getCountByOffice(body);
  }
  getLengthByJob(body: { jobNumber: string }) {
    return this.satInterfaceService.getLengthByJob(body);
  }

  getGoodFeatures(clasifNum: number) {
    return this.goodService.getGoodAtributesByClasifNum(clasifNum);
  }

  getMaxPaperWorkByExpedient(expedient: string) {
    return this.httClient.get(
      'http://sigebimsqa.indep.gob.mx/proceduremanagement/api/v1/proceduremanagement/max/' +
        expedient
    );
  }

  getUnitsByClasifNum(clasifNum: number, params: ListParams) {
    return this.httClient.get(
      'http://sigebimsqa.indep.gob.mx/goodsquery/api/v1/ligie-units-measure/getUnit/' +
        clasifNum,
      { params }
    );
  }

  getFractions(body: any) {
    return this.goodsQueryService.getFractions(body).pipe(
      map((response: any) => {
        if (!response.chapter) {
          throw new HttpErrorResponse({ status: 404 });
        }
        return response;
      })
    );
  }

  getLigieUnitDesc(unit: string) {
    return this.goodsQueryService.getLigieUnitDescription(unit);
  }

  getSatTransfer(body: any) {
    return this.satInterfaceService.getSatTransfer(body);
  }

  getSatTinmBreak(body: any) {
    return this.satInterfaceService.getSatTinmBreak(body);
  }

  getGoodLabelById(id: number) {
    return this.goodLabelService.getById(id);
  }

  getTempExpedientById(id: number | string) {
    return this.expedientService.getTempExpedientById(id);
  }

  getAllExpJob(body: any) {
    return this.satInterfaceService.findAllExpJob(body);
  }

  getDataGoodByDeparture(departureNum: string | number) {
    return this.goodService.getDataGoodByDeparture(departureNum);
  }

  getTempGood(body: any) {
    return this.goodService.getTempGood(body);
  }

  getFractionByClasifNum(clasifNum: number) {
    return this.goodsQueryService.getFractionsByClasifNum(clasifNum);
  }

  getGoodLabels() {
    const params = new ListParams();
    params.pageSize = 100;
    return this.goodLabelService.getAll(params);
  }

  getNoms(satUniqueKey: string) {
    return this.goodsQueryService.getNoms(satUniqueKey);
  }

  getSatTransExp(body: any) {
    return this.satInterfaceService.getSatTransExp(body);
  }

  createGood(body: any) {
    return this.goodService.create(body);
  }

  updateGood(id: string | number, body: any) {
    return this.goodService.update(id, body);
  }

  getLabelsByClasif(clasifNum: string | number) {
    return this.statusGoodService.getLabelsByClasif(clasifNum);
  }

  getInterfaceFgr(params: string) {
    return this.interfaceFgrService.getPgrTransferFiltered(params);
  }

  getLabelById(id: string | number) {
    return this.goodLabelService.getById(id);
  }

  getTmpNotifications(params: string) {
    return this.tpmNotificationService.getAllWithFilters(params);
  }

  createNotification(notification: any) {
    return this._notificationService.create(notification);
  }
}
