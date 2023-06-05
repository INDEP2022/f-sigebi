import { ILocality } from './locality.model';
import { IMunicipality } from './municipality.model';

export interface IStorehouse {
  idStorehouse: number | null;
  manager: string | null;
  description: string | null;
  municipality: IMunicipality;
  locality: ILocality;
  ubication: string | null;
  idEntity: number | null;
}
