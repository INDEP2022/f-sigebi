export interface IGoodPossessionThirdParty {
  possessionNumber: number;
  text: string;
  steeringwheelNumber: number;
  usrAddressee: string;
  usrCcp1: string;
  usrCcp2: string;
  usrResponsible: string;
  jobKey: string;
  numClueNavy: number;
  delegationCloseNumber: number;
  closingDate: string;
  nbOrigin: string;
}

export interface IDetailGoodPossessionThirdParty {
  possessionNumber: string;
  goodNumber: string;
  steeringwheelNumber: string;
  nbOrigin: string;
}

export interface IStatusHistory {
  changeDate: string;
  justification: string;
  status: string;
  usrRegister: string;
}
