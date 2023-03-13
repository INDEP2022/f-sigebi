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
