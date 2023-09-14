export interface TypesInventory {
  cveTypeInventory: string;
  description: string;
  noRegister: string;
}

export interface IInventoryQuery {
  noTypeInventory: string;
  attributeInventory: string;
  typeData: string;
  cveTypeInventory: string;
  noRegister: string;
  typesInventory: TypesInventory;
}

export interface IInventoryGood {
  inventoryNumber?: number;
  dateInventory: Date;
  responsible: string;
  goodNumber: number;
  cvetypeInventory?: string;
  registerNumber?: number;
}

export interface ILineaInventory {
  inventoryNumber: number;
  typeInventoryNumber: number;
  goodNumber: number;
  valueAttributeInventory: string;
  registerNumber?: number;
}
