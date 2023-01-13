import { IGoodSssubtype } from './good-sssubtype.model';
import { IGoodSsubType } from './good-ssubtype.model';
import { IGoodSubType } from './good-subtype.model';
import { IGoodType } from './good-type.model';

export interface ITypesByClasificationRaw {
  id: string;
  noType: string;
  descType: string;
  noSubtype: string;
  descSubtype: string;
  noSsubtype: string;
  descSsubtype: string;
  noSssubtype: string;
  descSssubtype: string;
}

export interface ITypesByClasification {
  id: string;
  type: Partial<IGoodType>;
  subtype: Partial<IGoodSubType>;
  ssubtype: Partial<IGoodSsubType>;
  sssubtype: Partial<IGoodSssubtype>;
}
