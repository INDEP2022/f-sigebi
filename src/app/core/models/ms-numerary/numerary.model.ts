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

export interface IRequesNumeraryEnc {
  solnumId: number;
  solnumDate: string;
  description: string;
  solnumType: string;
  delegationNumber: number;
  user: string;
  solnumStatus: string;
  procnumId: number;
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
  procnumId: string | number;
  procnumDate: string;
  description: string;
  user: string;
  procnumType: string;
  interestAll: string | number;
  numeraryAll: string | number;
  recordNumber: string | number;
}
