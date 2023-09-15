export interface IAccountDetailInd extends IAccountDetailIndNotCheck {
  accountnumberorigindeposit?: string;
  amountwithoutinterest: string;
  creditedinterest: string;
  expensesadmon: string;
  associatedexpenses: string;
  returnamount: string;
  accountnumberpayreturn?: any;
  devolutionnumber: string | number;
  checkfolio: string;
  checktype: string;
  checkpayee: string;
  expeditioncheckdate: string;
  checkcashingdate: string;
  accounttras?: string;
}

export interface IAccountDetailIndNotCheck {
  bankkey: string;
  coinkey: string;
  deposit: string;
  interestcalculationdate: string;
  transferaccountnumber: string;
  expedientnumber: string;
  goodnumber: string;
  depositnumber: string;
  accountnumber: string;
  movementnumber: string;
  accountkey: string;
  preliminaryinvestigation?: any;
  criminalcause: string;
  nameindicated: string;
  movementdate: string;
  keyratecalculationinterest?: any;
  description: string;
  status: string;
  scheduleddatebyconfiscationreturn?: any;
}
