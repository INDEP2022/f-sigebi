export interface IGoodProgramming {
  id?: number;
  typeGoodId?: string;
  goodId?: number;
  subTypeGoodId?: string;
  startDate?: Date;
  endDate?: Date;
  creationUser?: string;
  creationDate?: Date;
  modificationUser?: string;
  aliasWarehouse?: string;
  modificationDate?: Date;
  storeId?: number;
  townshipKey?: number;
  aliasStore?: number;
  code?: number;
  postalCode?: number;
  suburb?: number;
  settlementKey?: number;
  tranferId?: number;
  regionalDelegationNumber?: number;
  typeUser?: string;
  version?: number;
  status?: string;
  programmingLee?: string;
  folio?: string;
  typeRelevantId?: number;
  statusEbs?: string;
  concurrentNumber?: string;
  concurrentMsg?: string;
  validateGood?: string;
  instanceBpm?: number;
  emailTransfer?: string;
  termEjecutionDate?: string;
  city?: string;
  address?: string;
  nameTe?: string;
  observation?: string;
  eventId?: string;
  msgSise?: string;
  instanceSise?: string;
  acuseEvent?: string;
  nameSignatore?: string;
  chargeSignatore?: string;
  typeSignature?: string;
  contentId?: string;
  formalizationEndDate?: string;
  indFulfillTime?: string;
  stationId?: number;
  autorityId?: number;
  delregAttentionId?: number;
  stateKey?: number;
  instanceBpel?: string;
  regSendSat?: string;
  subtypegood?: string;
  typegood?: string;
  view?: IView[];
}

export interface IView {
  googId: number;
  uniqueKey: string;
}

export interface IPAAbrirActasPrograma {
  P_NOACTA: number | string;
  P_AREATRA: string;
  P_PANTALLA: string;
  P_TIPOMOV: number;
  USUARIO: string;
}

export interface IPACambioStatus {
  P_NOACTA: number | string;
  P_PANTALLA: string;
  P_FECHA_RE_FIS: Date;
  P_TIPO_ACTA: string;
  USUARIO: string;
}
export interface ITmpProgValidation {
  valmovement: number;
  valMessage: string;
  valUser: string;
  valMinutesNumber: number;
}

export interface IGoodProgrammingSelect {
  id: string;
  addressGood: number;
  aliasWarehouse: string;
  code: number;
  delegationRegionalId: number;
  transfereeId: number;
  googId: number;
  cveSettlement: number;
  cveState: number;
  cveTownship: number;
  decriptionGoodSae: string;
  descriptionGood: string;
  detailAddress: string;
  esReprogramming: number;
  hasMessage: string;
  idAuthority: 31;
  idDelegationRegional: number;
  idDelegationRegionalSol: number;
  idGood: number;
  idGoodProperty: number;
  goodNumber: number;
  idRequest: number;
  idStation: number;
  idSubtypeGood: number;
  idTransferee: number;
  idTypeGood: number;
  idTypeRelevant: number;
  keyUnique: string;
  numExt: number;
  numIn: number;
  physicalState: number;
  quantity: number;
  reasonCancReprog: number;
  statusGood: string;
  transferFile: number;
  typeTransfer: string;
  unitMeasurement: string;
  stockSiabNumber?: number;
}

export interface IGoodInfo {
  goodId?: number;
  uniqueKey?: string;
  fileNumber?: string;
  goodDescription?: string;
  aliasWarehouse?: string;
  description?: string;
  descriptionGoodSae?: string;
  quantity?: number;
  unitMeasure?: string;
  physicalStatus?: number | string;
  reprogrammationNumber?: number;
}

export interface IDomicileInfo {
  aliasWarehouse?: string;
  cveState?: number;
  cveMunicipality?: string;
  cveSettlement?: string;
  code?: string;
  viaName?: string;
  viaOrigin?: string;
  viaDestination?: string;
  viaChaining?: string;
  numExt?: string;
  numInt?: string;
}

export interface IPACambioStatusGood {
  P_NOACTA: number;
  P_AREATRA: string;
  P_PANTALLA: string;
}

export interface IHistoryProcesdingAct {
  minutesNumber: number;
  invoiceUniversal: number | string;
  dateMov: Date;
  nbOrigin?: string;
}
