import { IDelegation } from './delegation.model';
import { IStateOfRepublic } from './state-of-republic.model';

export interface ICity {
  idCity?: number;
  nameCity: string;
  state?: IStateOfRepublic;
  noDelegation: IDelegation | number;
  noSubDelegation: number;
  legendOffice: string;
  numRegister?: number;
}
