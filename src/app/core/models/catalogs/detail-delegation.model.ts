import { IDelegation } from './delegation.model';

export interface IDetailDelegation {
  id?: number;
  name: string;
  numberDelegation: IDelegation;
  area: string;
  position: string;
  location: string;
  address: string;
  mail: string;
  tel1: number;
  tel2: number;
  tel3: number;
}
