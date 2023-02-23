import { ICity } from './city.model';
import { ITransferente } from './transferente.model';

export interface IIssuingInstitution {
  no_clasificacion: number;
  numCity: number | ICity;
  numTransference: number | ITransferente;
  id?: number;
  name: string;
  description: string;
  manager: string;
  street: string;
  numInside: string;
  numExterior: string;
  cologne: string;
  zipCode: number;
  delegMunic: string;
  phone: string;
  numClasif: number;
  numRegister: number;
}

export interface IOTClaveEntityFederativeByAsuntoSAT {
  otclave: string;
}
