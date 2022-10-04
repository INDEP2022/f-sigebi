export interface IGoodSubType {
  id?: number;
  idTypeGood: IGoodSubType;
  nameSubtypeGood: string;
  description: string;
  noPhotography: number;
  descriptionPhotography: string;
  noRegister: number;
  version: number;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
}
