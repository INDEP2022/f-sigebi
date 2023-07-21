export interface IComerEvent {
  id?: number;
  tpeventoId?: number;
  StatusvtaId?: string;
  processKey?: string;
  observations?: string;
  address?: string;
  failedDate?: Date;
  place?: string;
  eventDate?: Date;
  text1?: string;
  text2?: string;
  signatory?: string;
  signatoryPost?: string;
  notes?: string;
  textEnd3?: string;
  textEnd4?: string;
  basisCost?: number;
  basisVendNumber?: number;
  username?: string;
  month?: number;
  year?: number;
  delegationNumber?: number;
  phaseInmu?: number;
  thirdEatId?: number;
  notificationDate?: Date;
  closingEventDate?: Date;
  tpsolavalId?: number;
  applyIva?: string;
  eventClosingDate?: string;
  failureDate?: string;
  thirdId?: string;
  eventTpId?: string;
}

export interface IComerEventRl {
  eventDadId: number;
  registrationNumber: number;
  id: {
    id?: number;
    tpeventoId?: number;
    StatusvtaId?: string;
    processKey?: string;
    observations?: string;
    address?: string;
    failedDate?: Date;
    place?: string;
    eventDate?: Date;
    text1?: string;
    text2?: string;
    signatory?: string;
    signatoryPost?: string;
    notes?: string;
    textEnd3?: string;
    textEnd4?: string;
    basisCost?: number;
    basisVendNumber?: number;
    username?: string;
    month?: number;
    year?: number;
    delegationNumber?: number;
    phaseInmu?: number;
    thirdEatId?: number;
    notificationDate?: Date;
    closingEventDate?: Date;
    tpsolavalId?: number;
    applyIva?: string;
  };
}

export interface IComerEvent2 {
  //Model regresado de thirdparty/api/v1/comer-commissions-per-good
  eventId: number;
  tpEventId: number;
  salesStatusId: string;
  cveProcess: string;
  observations: string;
  address: string;
  failedDate: string;
  place: string;
  eventDate: string;
  text1: string;
  text2: string;
  signatory: string;
  signatoryPost: string;
  grades: string;
  endtext3: string;
  endtext4: string;
  costBase: number;
  numBasesell: number;
  user: string;
  month: number;
  year: number;
  delegationNumber: number;
  phaseimmu: number;
  thirdComerId: number;
  notificationDate: string;
  closingEventDate: string;
  tpsolavalId: number;
  applyvat: string;
}

export interface IComerLotEvent {
  year: number;
  week: number;
  goodNumber: number;
  event: {
    processKey: string;
  };
  tpEvent: number;
  incorporationDate: Date;
  soldout: string;
  type: number;
  origin: string;
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
  eventDate: Date;
  unit: string;
  salePrice: number;
  cost: number;
  customerId: number;
  salePriceLot: number;
  ivaSale: number;
  ivaSaleLot: number;
  saleNoappiva: number;
  incRemeDate: Date;
  ois: string;
  invoiceNumber: string;
  invoiceDate: Date;
  statusLot: string;
  address: string;
  usernameCreate: string;
  usernameCreateRem: string;
  transfereeNumber: number;
  lotId: number;
  eventpre: number;
  lotpre: number;
  affectationDate: string;
  eventDad: number;
  idEvent: number;
  processKey: string;
}

export interface EventXSerie {
  idInvoiceFolio: string;
  idTpevent: IdTpevent;
  commentary: any;
}

export interface IdTpevent {
  id: string;
  description: string;
  descReceipt: string;
  use: string;
  typeDispId: string;
  typeFailedpId: string;
}
