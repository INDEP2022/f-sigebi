import { IGoodSubType } from './good-subtype.model';
import { IGoodType } from './good-type.model';

export interface IGoodSsubType {
  id?: number;
  description: string;
  noSubType: number | IGoodSubType;
  noType: number | IGoodType;
  noRegister: number;
}
