import { IStateOfRepublic } from './state-of-republic.model';

export class IDelegationState {
  id?: number;
  stateCode?: IStateOfRepublic[];
  userCreated?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  version?: number;
  keyState: number;
  status: number;
}
