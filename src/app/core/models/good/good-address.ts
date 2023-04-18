import { IRegionalDelegation } from '../catalogs/regional-delegation.model';

export interface IGoodAddress {
  id: number;
  code: string;
  description: string;
  exteriorNumber: string;
  interiorNumber: string;
  latitude: string;
  length: string;
  localityKey: number;
  municipalityKey: number;
  warehouseAliasName: string;
  regionalDelegationId: IRegionalDelegation;
  municipalityName: string;
  settlementKey: string;
  statusKey: number;
  version: number;
  warehouseAlias: any;
  wayChaining: string;
  wayDestiny: string;
  wayName: string;
  wayOrigin: string;
  wayref1Key: string;
  wayref2Key: string;
  wayref3Key: string;
}
