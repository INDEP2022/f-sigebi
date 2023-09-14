import { Injectable } from '@angular/core';
// import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';

export class IPhoGoodWidthData {
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
export class GoodsPhotoService extends IPhoGoodWidthData {
  // disabledBienes = true;
  disabledTable = true;
  disabledNoClasifBien = true;
  disabledDescripcion = true;
  haveTdictaUser = false;
  files: any[] = [];
  // di_numerario_conciliado: string;

  // newGood: any;
  // v_bien_inm: boolean;

  constructor() {
    super();
  }
}

export interface ICharacteristicValue {
  column: string;
  attribute: string;
  value: string;
  required: boolean;
  update: boolean;
  requiredAva: boolean;
  tableCd: string;
  editing: boolean;
  length: number;
  dataType: string;
}
