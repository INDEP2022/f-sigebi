export interface CertificatesDeliveryEndpoints {
  certificateId?: number;
  deliveryScheduleId?: number;
  certificateType?: number;
  clientIden?: number;
  clientIdennNum?: string;
  procClientIdennNum?: string;
  repLegal?: string;
  repLegalIden?: number;
  repLegalIdenNum?: string;
  repLegalIdenProg?: string;
  repLegalPosition?: string;
  virtue?: string;
  userCreation?: string;
  userModification?: string;
  creationDate?: string;
  modificationDate?: string;
  closing?: string;
  positionDesignation?: string;
  positionGrantee?: string;
  color?: string;
  descTransport?: string;
  writedate?: string;
  folioScale?: string;
  marck?: string;
  model?: string;
  driverName?: string;
  designeeName?: string;
  granteeName?: string;
  witnessName1?: string;
  witnessName2?: string;
  receivedWeight?: string;
  scaleTotalWeight?: string;
  plates?: string;
  receiveDonation?: string;
  serie?: string;
  transport?: string;
  version?: number;
  publicNotary?: string;
  publicDeed?: string;
  cveState?: number;
  adjudicator?: string;
  receiverType?: string;
  deliveryName?: string;
  postDelivery?: string;
  deliveryIden?: number;
  deliveryNum?: string;
  deliveryProcIden?: string;
  oficioDate?: string;
  folio?: string;
  authorizeReceive?: string;
  teName?: string;
  tePosition?: string;
  companyName?: string;
  certifiesPersonality?: string;
  oficioNum?: string;
  positionCompany?: string;
  oicParticipates?: string;
  oicName?: string;
  participateCommissioned?: string;
  reasonsNotAccepted?: number;
  reasonsNotDelivered?: number;
  reasonsNotRetired?: number;
  oicCall?: string;
}

export interface CertificatesGoodsEndpoints {
  certificateId?: number;
  goodId?: number;
  quantity?: number;
  userCreation?: string;
  userModification?: string;
  creationDate?: string;
  modificationDate?: string;
  version?: number;
  transactionId?: number;
  siabGoodNum?: number;
  goodsDeliveryScheduleId?: number;
}

export interface IQueryGoodTracker {
  vcsScreen: string;
  typeMinutes: string;
  relGood: string;
}
