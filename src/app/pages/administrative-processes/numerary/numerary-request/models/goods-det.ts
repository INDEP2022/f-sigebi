export interface NumDetGood {
  goodNumber: number;
  valid: string;
  description: string;
  deposit: string;
  fec_tesofe: string;
  bankInsertionDate?: string;
}

export interface NumDetGoodsDetail {
  allInterest: string;
  allNumerary: string;
  allPayNumber: string;
  allintPay: string;
  commission: string;
  currencyId: string;
  dateCalculationInterests: string;
  goodFatherpartializationNumber: string;
  goodNumber: number;
  recordNumber: string;
  solnumId: number;
  valid?: string;
  description?: string;
  bankDate?: string;
}

export interface GoodsExcel {
  paginated: Array<any>;
  countA: Number;
  countD: Number;
  file: Object;
}
