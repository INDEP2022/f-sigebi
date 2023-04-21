export interface IVigProcessPercentages {
  cveProcess: string;
  delegationNumber: string;
  delegationType: string;
  percentage: string;
  delegation: any;
  delegationView: any;
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
  delegationNumber: number;
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
