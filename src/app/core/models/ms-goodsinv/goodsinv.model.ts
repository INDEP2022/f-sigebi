export interface IGoodsInv {
  unit?: string;
  description?: string;
  registryNumber?: string;
}

export interface IDescInv {
  NO_GESTION: string;
  AG_DESCRIPCION_BIEN: string;
}

export interface IGoodResDevInvView {
  goodId?: number;
  solicitudId?: number;
  statusGood?: number;
  entryDate?: Date;
  uniqueKey?: string;
  fileNum?: number;
  goodDescription?: string;
  unitMeasurement?: string;
  physicalStatus?: string;
  conservationStatus?: string;
  quantity?: number;
  fractionId?: string;
  destination?: string;
  solicitude1Id?: number;
  transferType?: string;
  fileId?: number;
  transferFile?: string;
  officeNum?: string;
  regionalDelegationId?: number;
  stateKey?: number;
  transferId?: number;
  stationId?: number;
  authorityId?: number;
  fileType?: string;
  wayRecept?: string;
  typeRelevantId?: number;
  inventoryNum?: string;
  warehouseCode?: string;
  locatorId?: number;
  origin?: string;
  totalQuantity?: number;
  reservedQuantity?: number;
  transferQuantity?: number;
  decimalQuantity?: string;
  inventoryItemId?: number;
  organizationId?: number;
  folioAct?: string;
  transfereeType?: string;
  goodPropertyId?: number;
  locator?: string;
  byExit?: number;
}

export interface IGoodInvAvailableView {
  quantity?: number;
  client?: string;
  delRegSol?: number;
  descriptionGood?: string;
  dictumCompensation?: string;
  entTransfereeId?: number;
  commercialEvent?: string;
  bill?: string;
  commercialEventDate?: string;
  item?: string;
  locatorId?: string;
  commercialLot?: string;
  bienSiabNum?: number;
  managementNum?: string;
  inventoryNum?: string;
  origin?: string;
  satResolution?: string;
  type?: number;
  relevant_type?: number;
  transactionId?: string;
  uomCode?: string;
  inventoryKey?: string;
  eventType?: string;
  inventoryItemId?: string;
  organizationId?: number;
}

export interface IGoodInvDestructionView {
  quantity?: number;
  client?: string;
  delRegSol?: number;
  descriptionGood?: string;
  dictumCompensation?: string;
  entTransfereeId?: number;
  commercialEvent?: string;
  bill?: string;
  commercialEventDate?: string;
  item?: string;
  locatorId?: string;
  commercialLot?: string;
  bienSiabNum?: number;
  managementNum?: string;
  inventoryNum?: string;
  origin?: string;
  satResolution?: string;
  type?: number;
  relevant_type?: number;
  transactionId?: string;
  uomCode?: string;
  inventoryKey?: string;
  eventType?: string;
  inventoryItemId?: string;
  organizationId?: number;
}
