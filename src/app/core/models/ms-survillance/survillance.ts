export interface IVigProcessPercentages {
  cveProcess: string;
  delegationNumber: string;
  delegationType: string;
  percentage: string;
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
