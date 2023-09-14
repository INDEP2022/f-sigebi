export interface IRegulatory {
  id?: number;
  fractionId: number;
  number: number;
  description: string;
  validateEf: string;
  validateEc: string;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  version: number;
}
