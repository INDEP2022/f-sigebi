export interface IStation {
  id: number | null;
  idTransferent: number;
  idEntity: string | null;
  stationName: string | null;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
  keyState: number | null;
  version: number | null;
  status: number | null;
  nameAndId?: string;
}
