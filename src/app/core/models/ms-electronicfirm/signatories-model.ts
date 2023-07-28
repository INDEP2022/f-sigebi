export interface ISignatories {
  learnedType?: string;
  learnedId?: string;
  name?: string;
  post?: string;
  certificate?: File;
  keycertificate?: File;
  pass?: string;
  userCreation?: string;
  creationDate?: string | Date;
  userModification?: string;
  modificationDate?: string | Date;
  version?: number;
  signature?: string;
  mistakemsg?: string;
  boardSignatory?: string;
  columnSignatory?: string;
  recordId?: string;
  certificatebase64?: string;
  identifierSystem?: string;
  identifierSignatory?: string;
  validationocsp?: boolean;
  rfcUser?: string;
  signatoryId?: number;
  IDNumber?: string;
  id?: number;
  nbOrigin?: string;
  nameSignatore?: string;
  chargeSignatore?: string;
}

export interface IComerDocumentsXML {
  documensxmltid: number;
  consecutivenumber: number;
  referenceid: number;
  documentid: number;
  creationdate: Date;
  title: string;
  screenkey: string;
  reportkey: string;
  description: string;
  user: string;
  name: string;
  denomination: string;
  firmdate: Date;
}

export interface IUpdateComerPagosRef {
  referenceId: number;
  documentId: number;
}

export interface IComerOrigins {
  originId: number;
  screenKey: string;
  signatoriesNumber: number;
  description: string;
  reportKey: string;
  recordNumber: number;
  nbOrigin: string;
}
