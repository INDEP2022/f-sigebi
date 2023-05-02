import { IGoodSsubType } from './good-ssubtype.model';
import { IGoodSubType } from './good-subtype.model';
import { IGoodType } from './good-type.model';

export interface IGoodSssubtype {
  id?: number;
  description: string;
  numSsubType: number | IGoodSsubType;
  numSubType: number | IGoodSubType;
  numType: number | IGoodType;
  numRegister: number;
  numClasifAlterna: number;
  numClasifGoods: number;
}
