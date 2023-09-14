export interface IVigProcessPercentages {
  cveProcess: string;
  delegationNumber: string;
  delegationType: string;
  percentage: string;
  delegation: any;
  delegationView: any;
}

export interface IGeoreferencieObject {
  georefLatitude: string;
  georefLongituded: string;
  georeferenceId: string;
  id: string;
  typeId: string;
}

export interface IVigBinnacle {
  binnacleId: number;
  requestDate: Date;
  attentionDate: Date;
  processMnto: string;
  reasonMnto: string;
  usrRequest: string;
  usrRun: string;
  usrAuthorize: string;
  delegationNumber: IDelegation | number;
  delegation: IDelegation;
  sendId: number;
  bodyId: number;
}

export interface IViewVigDelegations {
  delegationNumber: string;
  description: string;
  typeDelegation: string;
  delegation: IDelegation;
}

export interface IDelegation {
  id: string;
  description: string;
  registerNumber: string;
  zoneContractKey: string;
  diffHours: string;
  phaseEdo: string;
  zoneVigilanceKey: null;
}

export interface IPolVigilancePerGood {
  goodNumber: string | number;
  cvePolicy: string;
  startPolDate?: Date | string;
  cveContract?: string;
  startVigDate: Date | string;
  additionInsured?: string;
  amountCousin?: string | number;
  cveCurrencySa?: string;
  incomeDate?: Date | string;
  inContractCurrent?: string;
  shiftsVigNumber: string | number;
  shiftsMedNumber: string | number;
  shiftsIndNumber: string | number;
  shiftsCanNumber: string | number;
  shiftsMechNumber?: string | number;
  shiftsIncNumber: string | number;
  indseg?: string;
  indVig?: string;
  recordNumber?: string;
  ingVigDate?: string | Date;
  cveRegsup: string;
}
