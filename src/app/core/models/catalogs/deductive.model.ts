export interface IDeductive {
  id: number | null;
  serviceType: string | null;
  weightedDeduction: number | null;
  startingRankPercentage: number | null;
  finalRankPercentage: number | null;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  version: number | null;
  status: number | null;
  contractNumber: number | null;
}
