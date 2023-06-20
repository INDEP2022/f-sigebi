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
