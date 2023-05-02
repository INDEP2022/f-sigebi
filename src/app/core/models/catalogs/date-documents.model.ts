export interface IDateDocuments {
  expedientNumber: IExpedient | number;
  stateNumber: IState | number;
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
export interface IState {
  id: number;
  inventoryNumber: number;
  goodId: number;
  description: string;
  quantity: string;
}
export interface IExpedient {
  alienationDate: string;
  articleValidated: string;
  authorityNumber: number;
  authorityOrdersDictum: string;
  batteryNumber: number;
  circumstantialRecord: string;
  confiscateDictamineDate: string;
  courtName: string;
  courtNumber: number;
  crimeKey: string;
  crimeStatus: string;
  criminalCase: string;
  dateAgreementAssurance: string;
  dateForesight: string;
  date_Dictamines: string;
  destructionDate: string;
  dictaminationDate: string;
  dictaminationReturnDate: string;
  donationDate: string;
  expTransferNumber: string;
  expedientStatus: string;
  expedientType: string;
  federalEntityKey: string;
  foresight: string;
  id: string;
  identifier: string;
  indicatedName: string;
  initialAgreement: string;
  initialAgreementDate: string;
  insertDate: string;
  insertMethod: string;
  insertedBy: string;
  insertionDatehc: string;
  keyPenalty: string;
  keySaveValue: string;
  lockerNumber: string;
  ministerialActOfFaith: string;
  ministerialDate: string;
  mpName: string;
  nameInstitution: string;
  notificationDate: string;
  notifiedTo: string;
  observations: string;
  observationsForecast: string;
  placeNotification: string;
  preliminaryInquiry: string;
  protectionKey: string;
  receptionDate: string;
  registerNumber: string;
  shelfNumber: string;
  stationNumber: number;
  transferNumber: number;
}
