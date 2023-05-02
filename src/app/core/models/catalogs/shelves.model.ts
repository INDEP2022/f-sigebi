import { IBattery } from './battery.model';
import { ISaveValue } from './save-value.model';

export interface IShelves {
  key?: string | ISaveValue;
  batteryNumber?: number | IBattery;
  id?: number;
  description: string;
  status: string;
  registerNumber?: number;
}
