import { IGood } from '../ms-good/good';

export interface IGoodJobManagement {
  managementNumber?: string;
  goodNumber?: IGood;
  recordNumber?: string;
}
export interface IGoodJobManagementByIds {
  managementNumber?: string;
  goodNumber?: number;
  recordNumber?: string;
}

export interface ImanagementOffice {
  flyerNumber: number | string;
  proceedingsNumber: number | string;
  cveManagement: string;
  managementNumber: number | string;
  officio: number | string;
  sender: string;
  delRemNumber: number | string;
  depRemNumber: number | string;
  addressee: number | string;
  city: number | string;
  text1: string;
  text2: string;
  statusOf: string;
  insertUser: string;
  areaUser: number | string;
  deleUser: number | string;
  insertDate: Date;
  jobType: string;
  nomPersExt: string;
  refersTo: string;
  jobBy: string;
  recordNumber: number | string;
  armedKeyNumber: number | string;
  desSenderpa: string;
  text3: string;
  insertHcDate: Date;
  projectDate: Date;
  description: string;
  problematiclegal: string;
  cveChargeRem: string;
  justification: string;
  count: number;
}

export interface ICopiesJobManagementDto {
  managementNumber: number | string;
  addresseeCopy: number | string;
  delDestinationCopyNumber: number | string;
  personExtInt: number | string;
  nomPersonExt: number | string;
  recordNumber: number | string;
  id: number | string;
}

export interface IdatosLocales {
  flyerNumber: string | number;
  proceedingsNumber: string | number;
  cveManagement: string | number;
  managementNumber: string | number;
  sender: string | number;
  delRemNumber: string | number;
  depRemNumber: string | number;
  addressee: string | number;
  city: string | number;
  text1: string | number;
  text2: string | number;
  paragraphFinish: string | number;
  statusOf: string | number;
  insertUser: string | number;
  areaUser: string | number;
  deleUser: string | number;
  jobType: string | number;
  nomPersExt: string | number;
  refersTo: string | number;
  jobBy: string | number;
  recordNumber: string | number;
  armedKeyNumber: string | number;
  desSenderpa: string | number;
  text3: string | number;
  description: string | number;
  problematiclegal: string | number;
  cveChargeRem: string | number;
  justification: string | number;
}
