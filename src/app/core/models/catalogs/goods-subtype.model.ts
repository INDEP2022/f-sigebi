import { IGoodType } from './good-type.model';

export interface IGoodsSubtype {
  id: number;
  idGoodType: number | IGoodType;
  nameGoodSubtype: number;
  userCreation: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  numberPhotographs: number;
  descFotographs: string;
  version: number;
}
