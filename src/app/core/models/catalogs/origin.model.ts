import { ICity } from './city.model';

export interface IOrigin {
  id?: number;
  idTransferer?: number;
  keyTransferer?: string;
  description: string | null;
  type: string;
  address: string;
  cityCode: ICity;
  idCity: number | null;
  keyEntityFederative: string;
}
