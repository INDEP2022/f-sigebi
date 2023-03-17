import { ICity } from './city.model';
import { IInstitutionClassification } from './institution-classification.model';
import { ITransferente } from './transferente.model';

export interface IIssuingInstitution {
  id?: number;
  name?: string;
  description?: string;
  manager?: string;
  street?: string;
  numInside?: string;
  numExterior?: string;
  cologne?: string;
  zipCode?: number;
  delegMunic?: string;
  phone?: string;
  numClasif?: number | IInstitutionClassification;
  numCity?: number | ICity;
  numRegister?: number;
  numTransference?: number | ITransferente;
  idCity?: number;
}

export interface IOTClaveEntityFederativeByAsuntoSAT {
  otclave: string;
}
