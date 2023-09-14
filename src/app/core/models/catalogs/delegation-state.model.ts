import { IStateOfRepublic } from './state-of-republic.model';

export class IDelegationState {
  regionalDelegation?: string;
  stateCode?: IStateOfRepublic[];
  userCreated?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  version?: string;
  keyState: string;
  status: string;
}
