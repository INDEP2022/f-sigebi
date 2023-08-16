export interface IDocumentsDictumXState {
  recordNumber: string;
  goodNumber: string;
  key: string;
  typeDictum: string;
  dateReceipt: string;
  userReceipt: string;
  insertionDate: string;
  userInsertion: string;
  numRegister: string;
  officialNumber: any;
  keyDocument: KeyDocument[];
}

export interface KeyDocument {
  key: string;
  description: string;
  typeDictum: string;
  numRegister: string;
  nbOrigin: any;
}

export interface KeyDocumentPeer {
  goodNumber: number;
  proceedingsNumber: number;
  solicitousDate: string;
  cveDocument: string;
  rulingType: string;
  solicitousUser: string;
  receivedDate: string;
}
