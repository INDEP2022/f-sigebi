import { IGood } from '../ms-good/good';

export interface INumerary {
  tasintId: number;
  month: number;
  year: number;
  lastDayMonth: number;
  captureDate: Date;
  user: string;
  dollars: number;
  pesos: number;
  euro: number;
}

export interface INumeraryxGoods {
  eventId: string;
  numeraryxGoodId: string;
  goodNumber: string;
  date: string;
  amount: string;
  public_lot: string;
  spentId: string;
  apply: string;
  cvman: string;
  origin: string;
  conversionType: string;
  indicted: number;
}

export interface INumeraryEnc {
  dateRequestNumerary: string;
  description: string;
  typeRequestNumerary: string;
  numberDelegation: any;
  user: any;
  statusRequestNumerary: string;
  procNumId: number;
  registerNumber: number;
}

export interface IRequestNumeraryEnc {
  solnumId?: string | number;
  solnumDate: string;
  description: string;
  solnumType: string;
  delegationNumber: string | number;
  user: string;
  solnumStatus: string;
  procnumId: string | number;
  recordNumber?: string | number;
}

export interface IRequesNumeraryEnc {
  solnumId: number;
  solnumDate: string;
  description: string;
  solnumType: string;
  delegationNumber: number;
  user: string;
  solnumStatus: string;
  procnumId: number | string;
  recordNumber: number;
  currency?: string;
  name?: string;
  desc_del?: string;
}

export interface IRequesNumeraryDet {
  solnumId: number;
  goodNumber: string | number;
  currencyId: string | number;
  allInterest: string | number;
  allNumerary: string | number;
  recordNumber: string | number;
  commission: string | number;
  allPayNumber: string | number;
  allintPay: string | number;
  goodFatherpartializationNumber: string | number;
  dateCalculationInterests: Date | string;
  good: IGood;
}

export interface IRequesNumeraryCal {
  solnumId: string | number;
  goodNumber: string | number;
  year: string | number;
  month: string | number;
  amount: string | number;
  interest: string | number;
  recordNumber: string | number;
  days: string | number;
}

export interface IProccesNum {
  procnumId?: string | number;
  procnumDate: string;
  description: string;
  user: string;
  procnumType: string;
  interestAll: string | number;
  numeraryAll: string | number;
  recordNumber?: string | number;
}

export interface TransferReg {
  reportNumber: string;
  transDate?: string;
  amountAll?: string;
  repDate?: string;
  accountKey?: string;
  delegationNumber?: string;
  invoiceCwNumber?: string;
  currencyKey?: string;
  historical: string;
}

export interface ISearchNumerary {
  conciled: string;
  goodNumber: number;
  fileNum: number;
  val1: string;
  val2: number;
  val4: string;
  val5: string;
  val6: string;
  fecTesofe?: Date | string;
}

export interface IPupAssociateGood {
  movementNo: number[];
  requestId: number;
  blkDeposit: number;
  cbdDeposit: number[];
  cbcveCurrency: string[];
}

export interface IRequesNum {
  applicationId?: number;
  deposit: number;
  relayTesofDate: Date | string;
  currencyKey: string;
}

export interface IRequesNumMov {
  applicationId: number;
  motionNumber: number;
  amountAssign: number;
}

export interface IMassiveReqNumEnc {
  solnumId: string[];
  solnumDate?: Date | string;
  description?: string;
  solnumType?: string;
  delegationNumber?: number;
  user?: string;
  solnumStatus?: string;
  procnumId?: string;
  recordNumber?: number;
}
