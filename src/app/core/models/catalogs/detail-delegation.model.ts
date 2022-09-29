import { IDelegation } from './delegation.model';

export interface IDetailDelegation {
  id?: number;
  name: string;
  numDelegation: IDelegation;
  area: string;
  position: string;
  location: string;
  address: string;
  mail: string;
  numP1: number;
  numP2: number;
  numP3: number;
}
