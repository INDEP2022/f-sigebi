export interface IMJobManagement {
  flyerNumber: string;
  proceedingsNumber: string;
  cveManagement: string;
  managementNumber: string;
  sender: string;
  delRemNumber: string;
  depRemNumber: string;
  addressee?: any;
  city: string;
  text1: string;
  text2?: any;
  statusOf: string;
  insertUser: string;
  areaUser: string;
  deleUser: string;
  insertDate: string;
  jobType: string;
  nomPersExt: any;
  refersTo: string;
  jobBy: string;
  recordNumber: string;
  armedKeyNumber: string;
  desSenderpa?: any;
  text3?: any;
  insertHcDate: string;
  projectDate: string;
  description?: any;
  problematiclegal?: any;
  cveChargeRem: string;
  justification: string;
}

export interface IRSender {
  no_delegacion: string;
  no_departamento: string;
  no_subdelegacion: string;
  nombre: string;
  usuario: string;
}

export interface IMJobManagementExtSSF3 {
  managementNumber: number;
  invoiceUniversal: number;
  recordNumber: number;
}
