export interface IDateDocuments {
  expedientNumber: number;
  stateNumber: number;
  key: IKey | string;
  typeDictum: string;
  dateReceipt: Date;
  userReceipt: string;
  insertionDate: Date;
  userInsertion: string;
  numRegister: number;
  officialNumber: number;
  notificationDate: Date;
  secureKey: number;
}
export interface IKey {
  key: number;
  description: string;
  typeDictum: string;
  numRegister: number;
}
