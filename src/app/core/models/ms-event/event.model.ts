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
