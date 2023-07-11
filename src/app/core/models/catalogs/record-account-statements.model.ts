export interface IRecordAccountStatements {
  numberMotion?: number;
  square?: number;
  accountNumber?: number;
  numberAccount?: number;
  branch?: string;
  accountType?: string;
  currency?: string;
  description?: number;
  balanceOf?: number;
  balanceAt?: number;
  data?: any[];
  count?: number;
  dateMotion?: string;
  userinsert?: string;
  deposit?: number;
  dateInsertion?: string;
  dateCalculationInterests?: Date | null;
  numberReturnPayCheck?: number;
  numberMotionTransfer?: number;
  numberGood?: number;
  genderTransfer?: string;
  withdrawal?: number;
  factasStatusCta?: {
    nombre?: string;
    cve_cuenta?: string;
  };
}

export interface IBanks {
  id?: number;
  name?: string;
}

export interface IFactasStatusCta {
  nombre?: string;
  cve_cuenta?: number;
}

export interface IDateAccountBalance {
  noAccount?: number;
  tiDateCalc?: string;
  tiDateCalcEnd?: string;
  result?: number;
}
