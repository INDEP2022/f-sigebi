export interface IGoodProgramming {
  id: number;
  typeGoodId: string;
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
  uniqueKey: string;
}
