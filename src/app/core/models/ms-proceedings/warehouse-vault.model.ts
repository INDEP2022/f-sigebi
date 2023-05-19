export interface IUpdateWarehouseVault {
  actNumber: number;
  actKey: string;
}

export interface IUpdateWarehouse extends IUpdateWarehouseVault {
  warehouseNumber: number;
}

export interface IUpdateVault extends IUpdateWarehouseVault {
  safeNumber: number;
}
