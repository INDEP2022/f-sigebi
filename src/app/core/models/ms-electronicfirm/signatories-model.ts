export interface ISignatories {
  learnedType?: string;
  learnedId?: string;
  name?: string;
  post?: string;
  certificate?: Buffer;
  keycertificate?: Buffer;
  pass?: string;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
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
