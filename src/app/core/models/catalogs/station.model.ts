export interface IStation {
  id: number | null;
  idTransferent: number;
  idEntity: string | null;
  stationName?: string | null;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  keyState: string;
  version: number | null;
  status: number | null;
  nameAndId?: string;
}

export interface IStation3 {
  id: number | null;
  idTransferent: number;
}

export interface IStation2 {
  id?: number;
  idTransferent?: number | null;
  stationName?: string;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  keyState?: string;
  version?: number;
  status?: number;
}
