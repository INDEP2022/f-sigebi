export interface IWarehouse {
  idWarehouse: number | null;
  description: string;
  ubication: string;
  manager: string;
  registerNumber: number | null;
  stateCode: number | null;
  cityCode: number | null;
  municipalityCode: number | null;
  localityCode: number | null;
  indActive: string | null;
  type: string | null;
  responsibleDelegation: number | string | null;
}
