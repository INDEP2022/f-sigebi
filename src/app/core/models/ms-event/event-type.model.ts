export interface IComerTpEvent {
  id: string;
  description: string;
  descReceipt: null | string;
  use?: null | string;
  typeDispId?: null | string;
  typeFailedpId?: null | string;
}

export interface IComerTpEventSend {
  id: string;
  year: number;
  phase: number;
  topost: number;
  warrantyDate: string | Date;
}

export interface IComerTpEventId {
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

export interface IComerTpEventFull {
  id: IComerTpEventId;
  year: number;
  phase: number;
  topost: number;
  warrantyDate: string | Date;
}
