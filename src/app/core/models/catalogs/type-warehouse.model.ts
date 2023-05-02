export interface ITypeWarehouse {
  id?: number;
  description?: string;
  userCreation?: string;
  creationDate?: Date;
  userModificatio?: string;
  modificatioDate?: Date;
  version?: number;
  estatus?: number;
}
export interface IWarehouseTypeWarehouse {
  warehouseTypeId: number;
  descriptionType: string;
  porcAreaA: number;
  porcAreaB: number;
  porcAreaC: number;
  porcAreaD: number;
  timeMaxContainer: number;
  timeMaxDestruction: number;
  registryNumber: number;
  insertDate: string;
  userInsert: string;
}
