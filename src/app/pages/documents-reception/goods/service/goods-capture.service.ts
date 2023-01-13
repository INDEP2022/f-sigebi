import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypesByClasificationService } from 'src/app/core/services/catalogs/types-by-clasification.service';
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
    private satInterfaceService: SatInterfaceService
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

  getSubtypeById(goodSubtypeId: number | string) {
    return this.goodSubtypeService.getById(goodSubtypeId);
  }

  getSsubtypeById(goodSsubtypeId: number | string) {
    return of<IGoodsSubtype>(ssubtype);
    // return this.goodSsubtypeService.getById(goodSsubtypeId);
  }

  getSssubtypeById(goodSssubtypeId: number | string) {
    return of<IGoodSssubtype>(sssubtype);
    // return this.goodSssubtypeService.getById(goodSssubtypeId);
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

  getGoodFeatures() {
    return goodFeatures;
  }
}

const ssubtype: any = {
  id: '1',
  noSubType: {
    id: '3',
    idTypeGood: '5',
    nameSubtypeGood: 'EQUIPOS Y APARATOS ELECTRONICO (mock)',
    noPhotography: '1',
    descriptionPhotography:
      '1 frente. Opcional, 1 del empaque, las necesarias que muestren las características principales del bien.',
    noRegister: '2707955',
    version: null,
    creationUser: 'SYSTEM',
    creationDate: '2016-04-04T00:00:00.000Z',
    editionUser: 'SYSTEM',
    modificationDate: '2016-04-04T00:00:00.000Z',
  },
  noType: {
    id: '5',
    nameGoodType: 'BIENES MUEBLES',
    maxAsseguranceTime: null,
    maxFractionTime: null,
    maxExtensionTime: null,
    maxStatementTime: null,
    maxLimitTime1: null,
    maxLimitTime2: null,
    maxLimitTime3: null,
    noRegister: '2707996',
    version: null,
    creationUser: 'SYSTEM',
    creationDate: '2016-04-04T00:00:00.000Z',
    editionUser: 'SYSTEM',
    modificationDate: '2016-04-04T00:00:00.000Z',
  },
  description: 'EQUIPO DE COMPUTO',
  noRegister: '2707795',
};

const sssubtype: any = {
  numClasifGoods: '1185',
  id: '1',
  description: 'LAPTOP',
  numSsubType: {
    id: '1',
    noSubType: '3',
    noType: '5',
    description: 'EQUIPO DE COMPUTO (mock)',
    noRegister: '2707795',
  },
  numSubType: {
    id: '3',
    idTypeGood: '5',
    nameSubtypeGood: 'EQUIPOS Y APARATOS ELECTRONICO',
    noPhotography: '1',
    descriptionPhotography:
      '1 frente. Opcional, 1 del empaque, las necesarias que muestren las características principales del bien.',
    noRegister: '2707955',
    version: null,
    creationUser: 'SYSTEM',
    creationDate: '2016-04-04T00:00:00.000Z',
    editionUser: 'SYSTEM',
    modificationDate: '2016-04-04T00:00:00.000Z',
  },
  numType: {
    id: '5',
    nameGoodType: 'BIENES MUEBLES',
    maxAsseguranceTime: null,
    maxFractionTime: null,
    maxExtensionTime: null,
    maxStatementTime: null,
    maxLimitTime1: null,
    maxLimitTime2: null,
    maxLimitTime3: null,
    noRegister: '2707996',
    version: null,
    creationUser: 'SYSTEM',
    creationDate: '2016-04-04T00:00:00.000Z',
    editionUser: 'SYSTEM',
    modificationDate: '2016-04-04T00:00:00.000Z',
  },
  numRegister: '2707445',
  numClasifAlterna: '15',
};

const goodFeatures = [{}];
