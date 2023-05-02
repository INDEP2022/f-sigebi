export interface IDeductive {
  id?: number;
  serviceType: string;
  weightedDeduction: number;
  startingRankPercentage: number;
  finalRankPercentage: number;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  version: number;
  status: number;
  contractNumber: number;
}
