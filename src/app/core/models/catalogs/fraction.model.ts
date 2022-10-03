import { INorm } from './norm.model';

export interface IFraction {
  id?: number;
  code: string;
  level: string;
  description: string;
  parentId: number;
  normId: INorm | number;
  unit: string;
  clasificationId: number;
  userCreation: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  version: number;
  relevantTypeId: number;
  codeErp1: string;
  codeErp2: string;
  codeErp3: string;
  decimalAmount: string;
  status: string;
  fractionCode: number;
}
