import { ITransferente } from './transferente.model';
export interface IStateByTransferent {
  idTransferee?: number;
  stateKey?: number;
  version?: number;
  transferent?: ITransferente | string;
  state?: IState | string;
}

export interface IState {
  id: string;
  descCondition: string;
  codeCondition: string;
  registrationNumber: number;
  nmtable: number;
  abbreviation: string;
  risk: number;
  version: number;
  zoneHourlyStd: string;
  zoneHourlyVer: string;
  userCreation: string;
  creationDate: string;
  userModification: string;
  modificationDate: string;
}
