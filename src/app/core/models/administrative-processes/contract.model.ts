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

interface IZone {
  recordNumber: string;
  numberDelegation: string;
  zoneContractKey: string;
}
