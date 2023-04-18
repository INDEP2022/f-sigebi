import { IGood } from './goods.model';
export interface IFinancialIndicators {
  id: number;
  name: string;
  description: string;
  formula: string;
  //registerNumber: number;
}
export interface IFinancialIndicatorsW {
  idIndicatorDate: string;
  idGoodNumber: IGood;
  idIndicatorNumber: string;
  value: number;
  registryNumber: number;
}
