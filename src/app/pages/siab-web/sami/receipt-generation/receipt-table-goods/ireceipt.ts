export interface IReceiptItem {
  id_recorrido: string;
  guardado: string;
  seleccionar: number;
  id_bien: string;
  clave_unica: string;
  no_expediente: string;
  descripcion_bien: string;
  descripcion_bien_sae?: any;
  cantidad: string;
  cantidad_sae: string;
  estatus_bien_programacion: string;
  estatus_bien_bien: string;
  estatus_programacion_bien: string;
  unidad_medida: string;
  unidad_medida_letra: string;
  unidad_medida_sae: string;
  unidad_medida_sae_letra?: any;
  id_programacion: string;
  estado_fisico: string;
  estado_fisico_letra: string;
  estado_fisico_sae: string;
  estado_fisico_sae_letra: string;
  estado_conservacion: string;
  estado_conservacion_letra: string;
  estado_conservacion_sae: string;
  estado_conservacion_sae_letra: string;
  destino: string;
  destino_letra: string;
  destino_transferente: string;
  destino_transferente_letra: string;
  destino_sae: string;
  destino_sae_letra: string;
}
export interface IReceiptExceltem {
  ID: number;
  ID_BIEN: number;
  CLAVE_UNICA: string;
  NO_EXPEDIENTE: string;
  DESCRIPCION_BIEN_TASFERENTE: string;
  DESCRIPCION_BIEN_SAE: string;
  CANTIDAD_TRASFERENTE: string;
  CANTIDAD_SAE: string;
  UNIDAD_MEDIDA_TRASFERENTE: string;
  UNIDAD_MEDIDA_SAE: string;
  ESTADO_FISICO_TRASFERENTE: string;
  ESTADO_FISICO_SAE: string;
  ESTADO_CONSERVACION_TRASFERENTE: string;
  ESTADO_CONSERVACION_SAE: string;
  DESTINO: string;
  DESTINO_TRASFERENTE: string;
  DESTINO_SAE: string;
  ID_PROGRAMACION: number;
  OBSERVACIONES?: string;
}
export interface IReceiptGoodItem {
  id_recorrido?: string;
  guardado?: string;
  seleccionar?: number;
  id_bien?: string;
  clave_unica?: string;
  no_expediente?: string;
  descripcion_bien?: string;
  descripcion_bien_sae?: any;
  cantidad?: number;
  cantidad_sae?: number;
  estatus_bien_programacion?: string;
  estatus_bien_bien?: string;
  estatus_programacion_bien?: string;
  unidad_medida?: string;
  unidad_medida_letra?: string;
  unidad_medida_sae?: string;
  unidad_medida_sae_letra?: any;
  id_programacion?: number;
  estado_fisico?: number;
  estado_fisico_letra?: string;
  estado_fisico_sae?: number;
  estado_fisico_sae_letra?: string;
  estado_conservacion?: number;
  estado_conservacion_letra?: string;
  estado_conservacion_sae?: number;
  estado_conservacion_sae_letra?: string;
  destino?: number;
  destino_letra?: string;
  destino_transferente?: number;
  destino_transferente_letra?: string;
  destino_sae?: number;
  destino_sae_letra?: string;
  observaciones?: string;
}
export interface IProgramingReception {
  id: number;
  typeGoodId?: any;
  subTypeGoodId?: any;
  startDate: string;
  endDate: string;
  creationUser: string;
  creationDate: string;
  modificationUser: string;
  modificationDate: string;
  storeId?: any;
  tranferId?: any;
  regionalDelegationNumber: string;
  typeUser: string;
  version?: any;
  status?: any;
  programmingLee?: any;
  folio?: any;
  typeRelevantId?: any;
  statusEbs?: any;
  concurrentNumber?: any;
  concurrentMsg?: any;
  validateGood?: any;
  instanceBpm?: any;
  emailTransfer?: any;
  termEjecutionDate?: any;
  city?: any;
  address?: any;
  nameTe?: any;
  observation?: any;
  eventId?: any;
  msgSise?: any;
  instanceSise?: any;
  acuseEvent?: any;
  nameSignatore?: any;
  chargeSignatore?: any;
  typeSignature?: any;
  contentId?: any;
  formalizationEndDate?: any;
  indFulfillTime?: any;
  stationId?: any;
  autorityId?: any;
  delregAttentionId?: any;
  stateKey?: any;
  instanceBpel?: any;
  regSendSat?: any;
  subtypegood?: any;
  typegood?: any;
  good?: any;
}

export interface IprogrammingDelivery {
  id: string;
  startRestDate?: any;
  cretationUser: string;
  creationDate: string;
  modificationUser: string;
  modificationDate: string;
  typeEvent: string;
  startDate: string;
  endDate: string;
  client: string;
  store: string;
  officeDestructionNumber?: any;
  addressee?: any;
  chargeAddressee?: any;
  metodDestruction?: any;
  term?: any;
  company?: any;
  placeDestruction?: any;
  locationDestruction?: any;
  taxpayerName?: any;
  email: string;
  legalRepresentativeName?: any;
  addressAddressee?: any;
  version: string;
  disabled: string;
  status: string;
  instanceBpm: string;
  statusAut: string;
  programmingLee: string;
  typeUser: string;
  delRegId: string;
  statusNotification: string;
  auctionDate?: any;
  folio: string;
  announcementOic?: any;
  instancebpel?: any;
  responsibleSae?: any;
  responsibleTe?: any;
  chargeSae?: any;
  chargeTe?: any;
  typeFirmSae: string;
  tipeFirmTe?: any;
  contentId?: any;
  ontentTeId?: any;
  emailAddressCenterTe?: any;
  endEjecutionDate?: any;
  indFulfillTime?: any;
  transferId: string;
  statusInstance: string;
  statusInstanceNumber: string;
  specializedThird?: any;
  descripcionFactss?: any;
}

export interface IUpdateGoodDTO {
  description: string;
  managementNum: number;
  reasonMantle: string;
  usrMantle: string;
}

export interface IUpdateDateProgramingReceptionDTO {
  idProgramming: string;
  typeProgramming: string;
  reasonMantle: string;
  usrMantle: string;
  dateStart: string;
  dateEnd: string;
}
