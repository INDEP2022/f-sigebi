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
}
