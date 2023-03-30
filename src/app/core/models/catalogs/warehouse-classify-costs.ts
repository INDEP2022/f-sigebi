import { IWarehouseTypeWarehouse } from './type-warehouse.model';

export interface IWarehouseClassifyCosts {
  warehouseTypeId: IWarehouseTypeWarehouse;
  classifGoodNumber: number;
  costId: number;
  registryNumber: number;
}
