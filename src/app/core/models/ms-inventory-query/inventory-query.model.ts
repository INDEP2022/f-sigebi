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
