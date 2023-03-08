export interface IDetailIndParameter {
  indicatorNumber: number;
  endDate: string;
  contractZoneKey: string;
  initialDate: string;
  daysHolNumber: number;
  daysLimNumber: string;
  hoursLimNumber: string;
  registryNumber: number;
  initialDDate: string;
  endDDate: string;
  sinLimHour: string;
  indicator: string | IIndicator;
}
export interface IIndicator {
  id: number;
  description: string;
  procedureArea: string;
  registryNumber: number;
  certificateType: string;
  certificateRE: string;
}
