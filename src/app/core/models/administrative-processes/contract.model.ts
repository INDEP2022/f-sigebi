export interface IContract {
  id?: number;
  contractKey?: string; // max 60 caracteres
  zoneContractKey?: number; // max 3 caracters
  statusContract?: number;
  startDate?: string;
  endDate?: string;
  registerNumber?: number;
  zone?: IZone;
  vigContract?: boolean;
}

interface IDelegacion {
  idDelegation: string;
  stageedo: string;
  idZonegeographic: string;
  cveState: string;
  description: string;
  homeOffice: string;
  delegateRegional: string;
  cveZone: string;
  city: string;
  idCity: string;
  status: any;
  vat: string;
  numberRecord: string;
  cveZoneContract: string;
  cveZoneSurveillance: string;
  diffHour: string;
  version: any;
  userCreation: string;
  dateCreation: string;
  userModification: string;
  dateModification: string;
  nbOrigin: any;
}

export interface IZone {
  recordNumber: string;
  numberDelegation: string;
  zoneContractKey: string;
  delegationNumber: IDelegacion;
}
