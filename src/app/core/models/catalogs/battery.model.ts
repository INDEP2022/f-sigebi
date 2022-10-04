import { ISaveValue } from './save-value.model';

export interface IBattery {
  idBattery: number | null;
  storeCode: ISaveValue;
  description: string;
  status: string;
  registerNumber: number | null;
}
