import { IShelves } from './shelves.model';

export interface ILocker {
  saveValueKey?: string;
  numBattery?: number;
  numShelf?: number;
  id?: number;
  description?: string;
  status?: string;
  numRegister?: number;
  shelf?: IShelves;
}
