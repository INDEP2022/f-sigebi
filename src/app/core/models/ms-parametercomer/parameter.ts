export interface IParameter {
  parameter: string;
  value: string;
  description: string;
  address: string;
  typeEventId: number | null;
}

export interface ITypeEvent {
  id: number;
  description: string | null;
  descReceipt: string | null;
  use: string | null;
  typeDispId: number | null;
  typeFailedpId: number | null;
}

export interface IBrand {
  id: string;
  brandDescription: string;
}

export interface ISubBrands {
  idBrand: {
    id: string;
  };
  idSubBrand: string;
  subBrandDescription?: string;
}

export interface ISubBrandsModel {
  idBrand: string;
  idSubBrand: string;
}

export interface IUpdateSubBrands {
  idBrand: {
    id: string;
  };
  idSubBrand: string;
  subBrandDescription?: string;
  nbOrigin?: string;
}

export interface IUpdateSubBrandsModel {
  idBrand: string;
  idSubBrand: string;
  subBrandDescription: string;
  nbOrigin: string;
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
  indActive: boolean;
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
  idConsec: number;
  position: number;
  column: string;
  indActive: boolean;
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

export interface IComerLotEvent {
  idLot: number;
  idStatusVta: string;
  event: IEvent;
  lotPublic: number;
  description: string;
  baseValue: number;
  noTransferee: number;
  idClient: number;
  priceValuationRef: number;
  priceGuarantee: number;
  deliverDate: string;
  finalPrice: number;
  reference: string;
  referential: number;
  accumulated: string;
  validSystem: number;
  ivaLot: number;
  amountAppIva: number;
  amountNoAppIva: number;
  porcAppIva: number;
  porcNoAppIva: number;
  coordinationRegz: string;
  coordinatorReg: string;
  datoFiscMand: string;
  location: string;
  advance: string;
  amountWithoutIva: number;
  noJobnNotifies: number;
  printNotifies: number;
  idStatusvtant: number;
  numEstate: number;
  exceedsShortage: number;
  isAssigned: boolean;
  isScrap: boolean;
  requests: string;
  amountRetained: number;
  noDelegation: number;
  lotOrigin: number;
  coversLots: number;
  palette: string;
  assignedGuarantee: string;
  amountLiq: number;
  phase: string;
  nopartialities: string;
  pointsPercentage: number;
  advancePercentage: number;
  aIva: number;
  eat_events: IEvent;
}

export interface IEvent {
  id: number;
  tpeventoId: number;
  statusvtaId: string;
  processKey: string;
  observations: string;
  address: string;
  failedDate: string;
  place: string;
  eventDate: string;
  text1: string;
  text2: string;
  signatory: string;
  signatoryPost: string;
  notes: string;
  textEnd3: string;
  textEnd4: string;
  basisCost: number;
  basisVendNumber: number;
  username: string;
  month: string;
  year: string;
  delegationNumber: number;
  phaseInmu: string;
  thirdEatId: number;
  notificationDate: string;
  closingEventDate: string;
  tpsolavalId: number;
  applyIva: number;
}

export interface ILot {}

export interface IComerLots {
  year: number;
  week: number;
  goodNumber: IGoodPhoto;
  event: IEvent;
  tpEvent: number;
  incorporationDate: string;
  soldout: string;
  type: number;
  origin: number;
  stockNumber: number;
  eventcom: number;
  tpeventcom: number;
  delegationcNumber: number;
  delegationbNumber: number;
  amount: number;
  description: string;
  eventRem: number;
  lotRem: number;
  lot: number;
  lotComer: number;
  steve: string;
  delegationcm: number;
  status: string;
  eventDate: string;
  unit: string;
  salePrice: number;
  cost: number;
  customerId: number;
  salePriceLot: number;
  ivaSale: number;
  ivaSaleLot: number;
  saleNoappiva: number;
  incRemeDate: number;
  ois: number;
  invoiceNumber: number;
  invoiceDate: number;
  statusLot: string;
  address: string;
  usernameCreate: string;
  usernameCreateRem: string;
  transfereeNumber: number;
  lotId: number;
  eventpre: number;
  lotpre: string;
  affectationDate: string;
  eventDad: number;
}

export interface IComerLotsEG {
  year: number;
  week: number;
  goodNumber: number;
  event: IEvent;
  tpEvent: number;
  incorporationDate: string;
  soldout: string;
  type: number;
  origin: number;
  stockNumber: number;
  eventcom: number;
  tpeventcom: number;
  delegationcNumber: number;
  delegationbNumber: number;
  amount: number;
  description: string;
  eventRem: number;
  lotRem: number;
  lot: number;
  lotComer: number;
  steve: string;
  delegationcm: number;
  status: string;
  eventDate: string;
  unit: string;
  salePrice: number;
  cost: number;
  customerId: number;
  salePriceLot: number;
  ivaSale: number;
  ivaSaleLot: number;
  saleNoappiva: number;
  incRemeDate: number;
  ois: number;
  invoiceNumber: number;
  invoiceDate: number;
  statusLot: string;
  address: string;
  usernameCreate: string;
  usernameCreateRem: string;
  transfereeNumber: number;
  lotId: number;
  eventpre: number;
  lotpre: string;
  affectationDate: string;
  eventDad: number;
}

export interface IClientLot {
  rfc: string;
  calle: string;
  delegacion: string;
  colonia: string;
  ciudad: string;
  estado: string;
  cp: string;
  idEvento: number;
}

export interface IRespLetter {
  id: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}
