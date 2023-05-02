import { IDelegation } from './delegation.model';

export interface ISubdelegation {
  id: number;
  description: string;
  delegationNumber: IDelegation | number;
  dailyConNumber?: number;
  dateDailyCon?: string;
  registerNumber?: number;
  phaseEdo?: number;
}
