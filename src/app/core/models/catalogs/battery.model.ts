import { ISaveValue } from './save-value.model';

export interface IBattery {
  idBattery: number;
  storeCode?: ISaveValue | string;
  description: string;
  status: string;
  registerNumber?: number;
}
