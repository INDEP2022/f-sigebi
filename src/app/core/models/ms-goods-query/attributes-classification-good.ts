export interface IAttribClassifGoods {
  classifGoodNumber?: number;
  columnNumber?: number;
  attribute: string;
  description: string;
  required: string;
  dataType: string;
  length: number;
  update: string;
  accessKey: string;
  tableCd: string;
  registrationNumber?: number;
  typeAct?: number;
}
// Obtener unidades de medida de acuerdo a la clasificacion
export interface IUnityByClasif {
  unit: string;
}

export interface IindicatorsEntRecep {
  recordNumber: string;
  indicatorNumber: string | number;
  recordType: string;
  recordKey: string;
  startDate: Date;
  endDate: Date;
  physicalReceptionDate: Date;
  maximumDate: Date;
  fileNumber: number;
  user: string;
  regional: number;
  assetNumber: number;
  quantity: number;
  evictionDaily: number | string;
  assetType: number | string;
  transfereeNumber: number;
  issuerNumber: number;
  authorityNumber: number;
  opinionKey: string;
  fulfilledIndicator: string;
  reviewIndft: number;
  correctIdft: number;
  userIdft: string;
  dateIdft: string;
  delegationNumberIdft: string;
  photoDate: string;
  photograph: number;
  status: string;
  destination: number;
  fulfilledFt: number;
}
