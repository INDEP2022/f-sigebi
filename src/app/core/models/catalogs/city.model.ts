import { IDelegation } from './delegation.model';

export interface ICity {
  idCity?: number;
  nameCity: string;
  state: IState;
  noDelegation: IDelegation | number;
  noSubDelegation: number;
  legendOffice: string;
  noRegister?: number;
}

export interface IState {
  cveState: string;
}
