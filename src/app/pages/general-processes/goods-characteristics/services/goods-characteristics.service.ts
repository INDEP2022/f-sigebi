import { Injectable } from '@angular/core';
import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';
import { IPhotoFile } from 'src/app/core/services/ms-ldocuments/file-photo.service';

export class ICharacteristicsWidthData {
  data: ICharacteristicValue[];
  dataDetails: {
    abreviatura: string;
    nmtabla: string;
    otclave: string;
    otvalor: string;
    info: string | number;
  }[];
  good: any;
  disabledTable: boolean = true;
}
@Injectable({
  providedIn: 'root',
})
export class GoodsCharacteristicsService extends ICharacteristicsWidthData {
  // disabledBienes = true;
  disabledNoClasifBien = true;
  disabledDescripcion = true;
  haveTdictaUser = false;
  files: IPhotoFile[] = [];
  // di_numerario_conciliado: string;

  // newGood: any;
  // v_bien_inm: boolean;

  constructor() {
    super();
  }
}
