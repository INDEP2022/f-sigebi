import { IDelegation } from './delegation.model';

export interface ICity {
  idCity?: number;
  nameCity: string;
  state: IState;
  noDelegation: IDelegation | number;
  noSubDelegation: number;
  legendOffice: string;
  numRegister?: number;
}

export interface IState {
  cveState: string;
}
