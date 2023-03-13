import { ICity } from './city.model';
import { ILocality } from './locality.model';
import { IMunicipality } from './municipality.model';
import { IStateOfRepublic } from './state-of-republic.model';

export interface IWarehouse {
  idWarehouse: number | null;
  description: string;
  ubication: string;
  manager: string;
  registerNumber: number | null;
  stateCode: IStateOfRepublic;
  cityCode: ICity;
  municipalityCode: IMunicipality;
  localityCode: ILocality;
  indActive: string | null;
  type: string | null;
  responsibleDelegation: number | string | null;
}
