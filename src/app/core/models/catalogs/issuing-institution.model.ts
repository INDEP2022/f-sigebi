import { IDelegation } from './delegation.model';
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
  numCity?: number | ICitys;
  numRegister?: number;
  numTransference?: number | ITransferente;
  idCity?: number;
}
export interface ICitys {
  name: string;
  numberCity: number;
  cveEntfed: number;
  numberDelegation: IDelegation | number;
  numbersubdelegation: number;
  numberRecord: number;
  legendJob: string;
}
export interface IOTClaveEntityFederativeByAsuntoSAT {
  otclave: string;
}
