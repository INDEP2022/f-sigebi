import { ICity } from './city.model';
import { ILocality } from './locality.model';
import { IMunicipality } from './municipality.model';
import { IStateOfRepublic } from './state-of-republic.model';

export interface ISafe {
  idSafe?: number | null;
  description?: string;
  ubication?: string;
  manager?: string;
  registerNumber?: number | null | string;
  stateCode?: number | null | string;
  stateDetail?: IStateOfRepublic;
  cityCode?: number | null | string;
  cityDetail?: ICity;
  municipalityCode?: number | null | string;
  municipalityDetail?: IMunicipality;
  localityCode?: number | null | string;
  localityDetail?: ILocality;
}

export interface ISafe2 {
  idSafe?: number | null;
  description?: string;
  ubication?: string;
  manager?: string;
  registerNumber?: number | null | string;
  stateCode?: number | null | string;
  stateDetail?: string | IStateOfRepublic;
  cityCode?: number | null | string;
  cityDetail?: string | ICity;
  municipalityCode?: number | null | string;
  municipalityDetail?: string | IMunicipality;
  localityCode?: number | null | string;
  localityDetail?: string | ILocality;
}
