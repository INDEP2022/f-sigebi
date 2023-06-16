import { ISafe } from './safe.model';

export interface IDrawer {
  noDrawer?: number | ISafe;
  id?: number;
  status?: string;
  noRegistration: number;
}
