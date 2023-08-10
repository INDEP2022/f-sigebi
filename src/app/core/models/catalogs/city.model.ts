import { IDelegation } from './delegation.model';
import { IState } from './state-model';
import { ISubdelegation } from './subdelegation.model';

export interface ICity {
  idCity?: number;
  nameCity: string;
  numberCity?: number;
  state?: IState;
  noDelegation: IDelegation | number;
  noSubDelegation: number;
  legendOffice: string;
  noRegister?: number;
  nameAndId?: string;
  delegation?: IDelegation;
  subDelegation?: ISubdelegation;
}

export interface ICityGetAll {
  idCity?: number;
  nameCity: string;
}
