import { IGood } from '../ms-good/good';
export interface IFinancialInformation {
  idInfoDate: string;
  idGoodNumber: string | number;
  idAttributeNumber: number;
  value: string | number;
}
export interface IFinancialInformationT {
  idInfoDate: string;
  idGoodNumber: IGood;
  idAttributeNumber: number;
  value: string | number;
  registryNumber: number;
}
