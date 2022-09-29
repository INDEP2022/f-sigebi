export interface IDeductiveVerification {
  id: number | null;
  description: string;
  percentagePena: number | null;
  verificationType: string;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
}
