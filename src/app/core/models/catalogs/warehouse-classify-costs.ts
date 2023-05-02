import { IWarehouseTypeWarehouse } from './type-warehouse.model';

export interface IWarehouseClassifyCosts {
  warehouseTypeId: IWarehouseTypeWarehouse;
  classifGoodNumber: number;
  descClassif: string;
  costId: number;
  descCost: string;
  registryNumber: number;
}
export interface IClassifyCosts {
  warehouseTypeId: IWarehouseTypeWarehouse;
  classifGoodNumber: number;
  costId: number;
  registryNumber: number;
}
export interface ICosts {
  costId: number;
  descCost: string;
}
