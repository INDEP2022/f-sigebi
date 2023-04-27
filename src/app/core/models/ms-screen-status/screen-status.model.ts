export interface IScreenXStatus {
  status: Status;
  description: string;
  screenKey: string;
  statusFinal: StatusFinal;
  action: string;
  statusNewGood: string;
  numberRecord: string;
  identifier?: any;
  guyruling?: any;
  processExtSun: string;
  id: number;
  segApplicationScreens: SegApplicationScreens;
}

export interface SegApplicationScreens {
  cveScreen: string;
  description: string;
  HEFindsInMenu: string;
  nameMenu: string;
  numberRecord: string;
  assignsattributes?: any;
  assignsAll: string;
}

export interface StatusFinal {
  status: string;
  description: string;
  numberRecord: string;
  numberManagement?: any;
  numberRencuen: string;
  numberjuntgob: string;
  numberinmalm?: any;
  numbercop?: any;
  codeRencuen: string;
  codejuntgob: string;
  codeinmalm: string;
  codecop: string;
}

export interface Status {
  status: string;
  description: string;
  numberRecord: string;
  numberManagement: string;
  numberRencuen: string;
  numberjuntgob: string;
  numberinmalm: string;
  numbercop: string;
  codeRencuen: string;
  codejuntgob: string;
  codeinmalm: string;
  codecop: string;
}
