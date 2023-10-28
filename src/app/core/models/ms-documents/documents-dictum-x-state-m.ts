export interface IDocumentsDictumXStateM {
  expedientNumber: number;
  stateNumber: number;
  typeDictum: string;
  key: string;
  dateReceipt: string;
  userReceipt: string;
  insertionDate: string;
  userInsertion: string;
  numRegister?: number;
  officialNumber: number;
  notificationDate: string;
  secureKey: string;
}

export interface IDataDocumentosBien {
  count: number;
  data: IDocumentsDictumXStateM[];
  message: string[];
}

export interface IDocumentsDictumXStateCreate {
  recordNumber: number;
  goodNumber: number;
  key: IKey;
  typeDictum: string;
  dateReceipt: string;
  userReceipt: string;
  insertionDate: string;
  userInsertion: string;
  numRegister: number;
  officialNumber: number;
}
export interface IKey {
  key: string;
  description: string;
  typeDictum: string;
  numRegister: number;
}
