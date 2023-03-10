export interface IIndicatorReport {
  id?: number;
  serviceType: string;
  startingPercentageRange: number;
  finalPercentageRange: number;
  contractualPenalty: number;
  contractNumber: string;
  userCreation: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  status: number;
  version: number;
}
