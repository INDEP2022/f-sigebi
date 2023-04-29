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
