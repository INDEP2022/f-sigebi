import { IDocCompensationSatXml } from './doc-compensation-sat-xml.model';
import { IDocCompesationSat } from './doc-compesation-sat.model';

export interface IDocCompensation {
  id?: number;
  satTypeJob: number;
  idTypeDocSat: number | IDocCompesationSat;
  idTypeDocSatXml: number | IDocCompensationSatXml;
  typeDocSae: string;
  type: number;
}
