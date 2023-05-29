import { IDelegation } from './delegation.model';
import { IState } from './state-model';

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
}
