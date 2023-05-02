import { IDelegation } from './delegation.model';
import { ISubdelegation } from './subdelegation.model';

export interface IDepartment {
  id?: number;
  numDelegation: number;
  numSubDelegation: ISubdelegation | number;
  dsarea: string;
  description: string;
  lastOffice: number;
  numRegister: number;
  level: number;
  depend: number;
  depDelegation: number;
  phaseEdo: number;
  delegation?: IDelegation | null;
}
