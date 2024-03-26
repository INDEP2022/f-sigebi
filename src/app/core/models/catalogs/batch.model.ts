import { IWarehouse } from './warehouse.model';

export interface IBatch {
  id?: number;
  numRegister: number;
  description: string;
  status: string;
  numStore?: IWarehouse;
}

export interface ILegalAffair {
  numStore?: IWarehouse;
  id?: number;
  legalAffair: string;
  versionv?: number;
  status?: number;
}
