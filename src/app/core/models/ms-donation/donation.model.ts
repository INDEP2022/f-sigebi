import { IWarehouse } from '../catalogs/warehouse.model';
import { IGood } from '../good/good.model';

export interface IDonationGood {
  statusId: string;
  noLabel: string;
  status: Status;
  tag: Tag;
  tagId?: string;
  statusDesc?: string;
  tagDesc: string;
}

export interface Status {
  status: string;
  description: string;
  registerNumber: string;
  managementNumber?: any;
  rencuenNumber: string;
  juntgobNumber: string;
  inmalmNumber: string;
  copNumber: string;
  rencuenCod: string;
  juntgobCod: string;
  inmalmCod: string;
  copCod: string;
}

export interface Tag {
  id: string;
  description: string;
}

export interface IFilterDonation {
  statusId: string;
  noLabel: number;
}
export interface IGoodDonation {
  actId: number;
  cveAct: string;
  elaborationDate: string;
  estatusAct: string;
  elaborated: string;
  fileId: number;
  witness1: string;
  witness2: string;
  actType: string;
  observElimination: string;
  observations: string;
  captureDate: string;
  noDelegation1: number;
  noDelegation2: string;
  identifier: string;
  folioUniversal: number;
  closeDate: string;
  timeCaptureDate: string;
  closeHcDate: string;
  registreNumber: number;
}
export interface IDetailDonation {
  recordId: number;
  goodId: number;
  amount: number;
  received: string;
  exchangeValue: number;
  registrationId: number;
}
export interface IExportDetail {
  recordId: number;
  typeActa: string;
  delegationId: number;
  nombre_transferente: string;
}

export interface IIndicators {
  noBien: number;
  noExpediente: number;
  estatus: string;
  description: string;
  amount: number;
  procesoExtDom: string;
  cveEvent: null;
  idEvent: number;
  idLot: number;
  numeraryNoEnt: number;
}
export interface ITransference {
  id: number;
  nameTransferent: string;
  keyTransferent: string;
  userCreation: string;
  dateCreation: string;
  userUpdate: string;
  dateUpdate: string;
  typeTransferent: string;
  version: string;
  status: string;
}
export interface IDelegationDon {
  id: number;
  description: string;
  registerNumber: number;
  zoneContractKey: string;
  diffHours: number;
  phaseEdo: number;
  zoneVigilanceKey: string;
}

export interface ITempDonDetail {
  id: number;
  user: string;
  delegationNumber: number;
  goodNumber: number;
  good: IGood;
  warehouse: IWarehouse;
  bienindicadores: IIndicators;
  transference: ITransference;
  delegation: IDelegationDon;
}
