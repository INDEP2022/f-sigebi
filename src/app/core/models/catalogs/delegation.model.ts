import { IZoneGeographic } from './zone-geographic.model';

export interface IDelegation {
  id: number;
  etapaEdo: number;
  cveState: string;
  description: string;
  addressOffice: string;
  regionalDelegate: string;
  cveZone: string;
  city: string;
  status: number;
  iva: number;
  noRegister: number;
  zoneContractCVE: number;
  zoneVigilanceCVE: number;
  diffHours: number;
  version: number;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  idZoneGeographic: number | IZoneGeographic;
}
