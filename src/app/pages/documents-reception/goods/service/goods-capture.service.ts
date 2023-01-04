import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';

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
  constructor(private httClient: HttpClient) {}

  findById(recordId: number) {
    return this.httClient.get<IRecord>(
      `http://sigebimsqa.indep.gob.mx/expedient/api/v1/find-identificator/${recordId}`
    );
  }

  /**
   * Obtener bien de resarcimiento
   * ? NO_CLASIF_BIEN = 1575
   */
  getGoodCompensation() {
    return this.httClient.get<IListResponse<ICompensationGood>>(
      'http://sigebimsqa.indep.gob.mx/api/v1/typesbyclasification/1575'
    );
  }

  getGoodTypesByClasificationNumber(clasificationNumber: number | string) {
    return this.httClient.get<IListResponse<ICompensationGood>>(
      'http://sigebimsqa.indep.gob.mx/api/v1/typesbyclasification/' +
        clasificationNumber
    );
  }
}
