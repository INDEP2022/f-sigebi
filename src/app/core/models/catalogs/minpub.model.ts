import { ICity } from './city.model';

export interface IMinpub {
  id?: number;
  description: string;
  manager: string;
  street: string;
  insideNumber: number;
  outNumber: number;
  colony: string;
  zipCode: number;
  delegNunic: string;
  cityNumber: number;
  phone: string;
  registryNumber: number;
  idCity: number;
  city: ICity;
  nameAndId?: string;
}
