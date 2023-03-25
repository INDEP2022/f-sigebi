import { ICity } from './city.model';

export interface ICourt {
  id?: number;
  description: string;
  manager: string;
  street: string;
  numExterior: string;
  numInside: string;
  cologne: string;
  delegationMun: string;
  zipCode: number;
  numPhone: string;
  circuitCVE: string;
  numRegister: number;
  nameAndId?: string;
}

export interface ICourtModel {
  court: ICourt;
  city: ICity;
  registerNumber?: number;
}
