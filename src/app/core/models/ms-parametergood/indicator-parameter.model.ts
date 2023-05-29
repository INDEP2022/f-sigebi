import { IProcedureArea } from '../catalogs/indicators-parameter.model';

export interface IIndicatorParameter {
  id: string;
  description: string;
  procedureArea: IProcedureArea;
  registryNumber: string;
  certificateType: null;
  certificateRE: null;
}
