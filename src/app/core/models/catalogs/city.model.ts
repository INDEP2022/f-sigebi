import { IDelegation } from './delegation.model';
import { IState } from './state-model';

export interface ICity {
  idCity?: number;
  nameCity: string;
  state?: IState;
  noDelegation: IDelegation | number;
  noSubDelegation: number;
  legendOffice: string;
  noRegister?: number;
  nameAndId?: string;
}
