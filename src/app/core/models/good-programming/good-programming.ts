export interface IGoodProgramming {
  id: number;
  typeGoodId: string;
  goodId: number;
  subTypeGoodId: string;
  startDate: Date;
  endDate: Date;
  creationUser: string;
  creationDate: Date;
  modificationUser: string;
  modificationDate: Date;
  storeId: number;
  tranferId: number;
  regionalDelegationNumber: number;
  typeUser: string;
  version: number;
  status: string;
  programmingLee: string;
  folio: string;
  typeRelevantId: number;
  statusEbs: string;
  concurrentNumber: string;
  concurrentMsg: string;
  validateGood: string;
  instanceBpm: number;
  emailTransfer: string;
  termEjecutionDate: string;
  city: string;
  address: string;
  nameTe: string;
  observation: string;
  eventId: string;
  msgSise: string;
  instanceSise: string;
  acuseEvent: string;
  nameSignatore: string;
  chargeSignatore: string;
  typeSignature: string;
  contentId: string;
  formalizationEndDate: string;
  indFulfillTime: string;
  stationId: number;
  autorityId: number;
  delregAttentionId: number;
  stateKey: number;
  instanceBpel: string;
  regSendSat: string;
  subtypegood: string;
  typegood: string;
  view: IView[];
}

export interface IView {
  googId: number;
  uniqueKey: string;
}

export interface IGoodProgrammingSelect {
  id: string;
  addressGood: number;
  aliasWarehouse: string;
  code: number;
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
}

export interface IGoodInfo {
  goodId: number;
  uniqueKey: string;
  fileNumber: string;
  description: string;
  descriptionGoodSae: string;
  quantity: number;
  unitMeasure: string;
  physicalStatus: number | string;
  reprogrammationNumber: number;
}
