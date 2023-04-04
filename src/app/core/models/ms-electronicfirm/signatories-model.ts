export interface ISignatories {
  learnedType?: string;
  learnedId?: string;
  name?: string;
  post?: string;
  certificate?: string | Buffer;
  keycertificate?: string | Buffer;
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
  validationocsp?: string;
  rfcUser?: string;
  signatoryId?: number;
  IDNumber?: string;
  ID?: string;
  nbOrigin?: string;
}
