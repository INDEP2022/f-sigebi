import { IBatch } from './batch.model';
import { IWarehouse } from './warehouse.model';

export class IRack {
  id: number;
  idWarehouse: number | IWarehouse;
  idBatch: number | IBatch;
  description: string;
  status: string;
  registerNumber: number | null;
}
