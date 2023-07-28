export interface ILocality {
  id: string;
  entityKey: string;
  municipalityKey: string;
  nameLocation: string;
  ambitKey: number;
  userCreation: string;
  description: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  version: number;
}

export interface ILocality2 {
  id: number;
  stateKey: number;
  municipalityId: number;
  nameLocation: string;
  ambitKey: number | string;
  description: string;
  delegationNumber: number;
  registerNumber: number;
  version: number;
  creationUser: string;
  creationDate: string;
  editionUser: string;
  modificationDate: string;
}

export interface ILocalityGetAll {
  idLocality: number;
  nameLocation: string;
}
