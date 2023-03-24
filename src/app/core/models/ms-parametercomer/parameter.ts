import { IEvent } from '../commercialization/event.model';

export interface IParameter {
  idParam: string;
  idValue: string;
  description: string;
  idDirection: string;
  eventTypeId: null;
}

export interface IBrand {
  id: string;
  brandDescription: string;
}

export interface ISubBrands {
  idBrand: string;
  idSubBrand: string;
  subBrandDescription?: string;
}

export interface ITiieV1 {
  id: number;
  tiieDays: number;
  tiieMonth: number;
  tiieYear: number;
  tiieAverage: number;
  registryDate: string;
  user: string;
}

export interface IComerLayoutsH {
  id: number;
  descLayout: string;
  screenKey: string;
  table: string;
  criterion: string;
  indActive: boolean;
  registryNumber: number;
}

export interface IComerLayouts {
  idLayout: IComerLayoutsH;
  idConsec: number;
  position: number;
  column: string;
  type: string;
  length: number;
  constant: string | number;
  carFilling: number;
  justification: string;
  decimal: string;
  dateFormat: string;
  registryNumber: number;
}

export interface ILay {
  idLayout: number;
  idConsec: number;
}

export interface IL {
  idLayout: number;
}

export interface IComerLayoutsW {
  position: number;
  column: string;
  type: string;
  length: number;
  constant: string | number;
  carFilling: number;
  justification: string;
  decimal: string;
  dateFormat: string;
  registryNumber: number;
}

export interface IPhoto {
  id: number;
  route: URL;
  status: string;
}

export interface IComerLot {
  id: number;
  statusVtaId: string;
  eventId: IEvent;
  publicLot: number;
  description: string;
  baseValue: number;
  transferenceNumber: number;
  customerId: number;
  appraisalPriceRef: number;
  warrantyPrice: number;
  deliveryDate: string;
  finalPrice: number;
  referenceG: string;
  referential: string;
  accumulated: number;
  systemValid: string;
  lotVat: number;
  amountAppVat: number;
  amountNoAppVat: number;
  vatAppPercentage: number;
  vatNoAppPercentage: number;
  regCoordination: string;
  regCoordinator: string;
  fiscMandFact: string;
  location: string;
  advance: number;
  amountWithoutVat: number;
  notifyOfficeNumber: number;
  notifyPrint: string;
  statusVtantId: number;
  goodsNumber: IGoodPhoto;
  faultExceeds: number;
  assignedEs: string;
  scrapEs: string;
  request: string;
  withheldAmount: number;
  delegationNumber: number;
  originLot: number;
  lotCover: number;
  palette: number;
  assignedWarranty: number;
  liqAmount: number;
  phase: number;
  partialitiesNumber: number;
  percentPoints: number;
  advancePercent: number;
  vatA: string;
}

export interface IGoodPhoto {
  goodNumber: number;
  consecNumber: number;
  photoDate: string;
  location: string;
  recordNumber: number;
  photoDateHc: string;
  publicImgcatWeb: number;
  existsfs: number;
  existsproduction: number;
}

export interface IFindPhoto {
  goodNumber: number;
  consecNumber: number;
}
