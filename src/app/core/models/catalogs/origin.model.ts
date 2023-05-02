export interface IOrigin {
  id: number | null;
  idTransferer: number;
  keyTransferer: string;
  description: string | null;
  type: string;
  address: string;
  city: string;
  idCity: number | null;
  keyEntityFederative: string;
}
