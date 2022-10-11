export interface IPenalty {
  id: number;
  serviceType: string;
  penaltyPercentage: number;
  equivalentDays: number;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  status: number;
  contractNumber: string;
  version: number;
}
