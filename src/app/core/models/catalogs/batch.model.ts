export interface IBatch {
  id?: number;
  numRegister: number;
  description: string;
  status: string;
  numStore?: {
    idWarehouse?: string;
    description?: string;
  };
}
