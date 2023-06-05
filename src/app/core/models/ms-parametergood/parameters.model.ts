export interface IParameters {
  id: string | null;
  description: string | null;
  initialValue: number | null;
  finalValue: number | null;
  startDate: Date | null;
  endDate: Date | null;
  registryNumber: number | null;
}

export interface IIndicatorParameters {
  id: string | number;
  description: string;
  procedureArea: string | number;
  registryNumber: string | number;
  certificateType: string | number;
  certificateRE: string;
}
