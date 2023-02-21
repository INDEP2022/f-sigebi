export interface IParameters {
  id: string | null;
  description: string | null;
  initialValue: number | null;
  finalValue: number | null;
  startDate: Date | null;
  endDate: Date | null;
  registryNumber: number | null;
}

export interface IParametersV2 {
  cve: string | null;
  description: string | null;
  initialValue: number | null;
  finalValue: number | null;
  startDate: Date | null;
  endDate: Date | null;
  registryNumber: number | null;
}
