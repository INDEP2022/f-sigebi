export interface ISaveValue {
  id?: string;
  description?: string;
  location?: string;
  responsible?: string;
  noRegistration?: string;
}

export interface IUpdateMassive {
  valueGuardKey: string;
  batteryStatus: string;
  shelfStatus: string;
  lockerStatus: string;
  batteryNumber: number;
  shelfNumber: number;
  lockerNumber: number;
  fileNumber: number | string;
}
