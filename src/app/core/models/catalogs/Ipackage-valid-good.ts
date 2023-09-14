export interface IpackageValidGood {
  pPaqueteNumber: number;
  pDelegationNumber: number;
  pGoodClasifNumber: number;
  pEtiquetaNumber: number;
  pStatus: string;
  pAlmacenNumber: number;
  pTypePaquete: number;
  pValidVal24: string;
}

export interface GoodsItem {
  goodNumber: number;
  transfereeNumber: number;
  coordAdmin: string;
  fileNumber: number;
  goodDescription: string;
  unitMeasure: string;
  quantity: number;
  val24: string;
  goodClassifyNumber: number;
  labelNumber: number;
  goodStatus: string;
  warehouseNumber: number;
}

export interface PrepDestinationPackage {
  packegeNumber: number;
  goodsList: GoodsItem[];
}
