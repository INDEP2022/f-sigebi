export interface IObjetoMovimiento {
  withdrawal: number | null;
  deposit: number | null;
  numberMotion: number | null;
  placeMotion: number | null;
  pierced: string | null;
  dateMotion: string | null;
  numberProceedings: string | null;
  date: string | null;
  desposit: number | null;
  retire: number | null;
}

export interface IAccountMovementCategory {
  category: string;
  description: string;
  inOut: string;
  registerNumber: string;
}

export interface IAccountNumber {
  accountNumber: number;
  accountNumberTransfer: string;
  registerNumber: string;
  delegationNumber?: any;
  cveAccount: string;
  accountType: string;
  cveCurrency: string;
  square?: any;
  branch?: any;
  cveInterestCalcRate?: any;
  cveBank: string;
  isReference?: any;
}

export interface IAccountMovement {
  withdrawal?: any;
  category: IAccountMovementCategory;
  deposit: string;
  numberMotion: string;
  placeMotion?: any;
  pierced?: any;
  dateMotion: string;
  numberProceedings: string;
  numberRecord: string;
  numberAccount: string;
  InvoiceFile?: any;
  genderTransfer?: any;
  postTransfer?: any;
  cveConcept?: any;
  userinsert: string;
  dateTransfer: string;
  ispartialization?: any;
  dateInsertion: string;
  userTransfer?: any;
  passDiverse?: any;
  numberGood?: any;
  numberMotionTransfer?: any;
  postDiverse?: any;
  dateCalculationInterests: string;
  isFileDeposit: string;
  numberReturnPayCheck?: any;
  goodsNumber?: any;
  accountNumber: IAccountNumber;
}

export interface IUserChecks {
  returnNumber: number;
  accountOriginDepositNumber: number;
  motionOriginDepositNumber: number;
  courtReturnDate: string;
  amountWithoutInterest: number;
  rateDear: number;
  interestReal: number;
  interestDear: number;
  billsadmin: number;
  interestaccredited: number;
  billsAssociates: number;
  amountReturn: number;
  accountPayReturnNumber: number;
  expeditionCheckDate: string;
  InvoiceCheck: string;
  paymentCheckDate: string;
  piercedTOAccount: string;
  beneficiaryCheck: string;
  checkType: string;
  registerNumber: number;
  nbOrigin: string;
}

export interface INumeraryTransfer {
  reportDevNumber: string;
  amountTotalDev: string;
  accountDevKey: string;
  delegationDevNumber?: string;
  reportDevDate: string;
  currencyDevKey: string;
  depositDevDate: string;
  checkNumber: string;
  nbOrigin: string;
}

export interface IAccountMovementShort {
  cve_banco: string;
  cve_cuenta: string;
  no_cuenta: string;
  no_cuenta_traspaso: string;
}

export interface IDetailAccountMovement {
  date: string | null;
  deposit: string | null;
  withdrawal: string | null;
}

export interface IPupInterestsDetail {
  pAmount: number;
  pDateToday: string;
  pDateStartMov: string;
  pMoneyDi: string;
  pCalculationRate: string;
  pBonusPoints: number;
  pDayxAnio: number;
}

export interface IMovementDetail {
  periodo: string;
  dias: string;
  Tasa: string;
  importe: string;
}
