export interface IBankAccount {
  accountNumber: string;
  accountNumberTransfer?: any;
  registerNumber: string;
  delegationNumber?: any;
  cveAccount: string;
  accountType: string;
  cveCurrency?: string | any;
  square?: any;
  branch: string;
  cveInterestCalcRate?: any;
  cveBank: string;
  isReference?: any;
}

export interface IAccountBank {
  accountNumber: string;
  accountNumberTransfer?: any;
  registerNumber: string;
  delegationNumber?: any;
  cveAccount: string;
  accountType: string;
  cveCurrency?: string | any;
  square?: any;
  branch: string;
  cveInterestCalcRate?: any;
  cveBank: string;
  isReference?: any;
  nbOrigin?: string;
  banco?: {
    bankCode: string;
    name: string;
    registerNumber?: any;
    ifdsc: string;
    dateType?: any;
    code: string;
    idProvider: string;
  };
}

export interface IBankCentral {
  cveAccount: number | string;
  typeAccount: string;
  cveBank: string;
  cveCurrency: string;
}

export interface IProReconcilesGood {
  bankKey?: string;
  accountKey?: string;
  deposit?: number;
  currencyKey?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}
