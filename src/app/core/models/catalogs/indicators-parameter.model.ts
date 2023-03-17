export interface IIndicatorsParamenter {
  id: number;
  description: string | IProcedureArea;
  procedureArea: string;
  registryNumber: number;
  certificateType: string;
  certificateRE: string;
}
export interface IProcedureArea {
  id: string;
  description: string;
  screenKey: string;
}
