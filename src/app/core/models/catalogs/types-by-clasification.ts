import { IGoodSssubtype } from './good-sssubtype.model';
import { IGoodSsubType } from './good-ssubtype.model';
import { IGoodSubType } from './good-subtype.model';
import { IGoodType } from './good-type.model';

export interface ITypesByClasificationRaw {
  id: string;
  noType: number;
  descType: string;
  noSubtype: number;
  descSubtype: string;
  noSsubtype: number;
  descSsubtype: string;
  noSssubtype: number;
  descSssubtype: string;
}

export interface ITypesByClasification {
  id: string;
  type: Partial<IGoodType>;
  subtype: Partial<IGoodSubType>;
  ssubtype: Partial<IGoodSsubType>;
  sssubtype: Partial<IGoodSssubtype>;
}
