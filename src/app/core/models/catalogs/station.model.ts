export interface IStation {
  id: number | null;
  idTransferent: number;
  idEntity: string | null;
  stationName?: string | null;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  keyState: number | null;
  version: number | null;
  status: number | null;
  nameAndId?: string;
}

export interface IStation2 {
  id?: number;
  idTransferent?: number;
  stationName?: string;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  keyState?: string;
  version?: number;
  status?: number;
}
