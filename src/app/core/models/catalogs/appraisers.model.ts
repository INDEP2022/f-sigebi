import { IGood } from '../ms-good/good';

export interface IAppraisers {
  id: number;
  description: string;
  street: string;
  noExterior: number;
  noInterior: number;
  colony: string;
  codepostal: number;
  deleg: string;
  rfc: string;
  tel: string;
  curp: string;
  represent: string;
  cveEntfed: number;
  observations: string;
  noRegistro: number;
}

export interface IAppraisersXGood {
  noGood: string | number;
  noRequest: string | number;
  appraisalDate: Date;
  effectiveDate: Date;
  registerDate: Date;
  cost: number;
  valueAppraisal: number;
  state: string;
  observations: string;
  noRegister: string | number;
  vPhysical: string | number;
  vCommercial: string | number;
  vTerrain: string | number;
  vConst: string | number;
  vInst: string | number;
  vOpportunity: string | number;
  vUnitaryM2: string | number;
  vMachEquip: string | number;
  good: IGood;
  requestXAppraisal: IRequestXAppraisal;
}

export interface IRequestXAppraisal {
  id: string;
  requestDate: Date;
  sourceUser: string;
  targetUser: string;
  requestType: string;
  paid: string;
  cveCurrencyCost: string;
  cveCurrencyAppraisal: string;
  observations: string;
  noAppraiser: string | number;
  noExpert: string | number;
  noRegister: string | number;
}
