import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypesByClasificationService } from 'src/app/core/services/catalogs/types-by-clasification.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodParameterService } from 'src/app/core/services/good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';

export interface IRecord {
  idExpedient: string;
  identifies: string;
  noCourt?: any;
  preliminaryInquiry?: any;
  criminalCase?: any;
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
    private dynamicCatalogService: DynamicCatalogService
  ) {}

  getInitialParameter(id: string) {
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

  getDynamicData(tdTable: string) {
    // return this.dynamicCatalogService.getDynamicData(tdTable);
  }

  getMaxPaperWorkByExpedient(expedientId: number) {
    return of(2);
  }
}
