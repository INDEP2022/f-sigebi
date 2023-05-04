import { INorm } from './norm.model';
import { ISiabClasification } from './siab-clasification.model';

export interface IFraction {
  id?: number;
  code: string;
  level: string;
  description: string;
  parentId?: number;
  normId: INorm | number;
  clasificationId: number;
  siabClasification?: string | ISiabClasification;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  version: number;
  relevantTypeId: number;
  codeErp1: string;
  codeErp2: string;
  codeErp3: string;
  decimalAmount: string;
  status: string;
  fractionCode: number;
}
