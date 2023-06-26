import { Injectable } from '@angular/core';
import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';

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
}
@Injectable({
  providedIn: 'root',
})
export class GoodsCharacteristicsService extends ICharacteristicsWidthData {
  // disabledBienes = true;
  disabledTable = true;
  disabledNoClasifBien = true;
  disabledDescripcion = true;
  haveTdictaUser = false;
  files: string[] = [];
  // di_numerario_conciliado: string;

  // newGood: any;
  // v_bien_inm: boolean;

  constructor() {
    super();
  }
}
