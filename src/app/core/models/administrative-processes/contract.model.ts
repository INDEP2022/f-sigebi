export interface IContract {
  id?: number;
  contractKey: string;
  zoneContractKey: number;
  statusContract: number;
  startDate: Date;
  endDate: Date;
  registerNumber: number;
  zone: IZone;
  vigContract: boolean;
}

interface IZone {
  recordNumber: string;
  numberDelegation: string;
  zoneContractKey: string;
}
