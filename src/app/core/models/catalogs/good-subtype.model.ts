import { IGoodType } from './good-type.model';

export interface IGoodSubType {
  id?: number;
  idTypeGood: number | IGoodType;
  nameSubtypeGood: string;
  noPhotography: number;
  descriptionPhotography: string;
  noRegister: number;
  version: number;
  creationUser?: string;
  creationDate?: Date;
  editionUser?: string;
  modificationDate?: Date;
}
