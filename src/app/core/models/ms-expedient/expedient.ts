export interface IExpedient {
  id: string | number;
  dateAgreementAssurance: Date;
  foresight: string;
  dateForesight: Date;
  articleValidated: Date;
  ministerialDate: Date;
  ministerialActOfFaith: string;
  date_Dictamines: Date;
  batteryNumber: string;
  lockerNumber: string;
  shelfNumber: string;
  courtNumber: string;
  observationsForecast: string;
  insertedBy: string;
  observations: string;
  insertMethod: string;
  insertDate: Date;
  receptionDate: Date;
  criminalCase: string;
  preliminaryInquiry: string;
  protectionKey: string;
  crimeKey: string;
  circumstantialRecord: string;
  keyPenalty: string;
  nameInstitution: string;
  courtName: string;
  mpName: string;
  keySaveValue: string;
  indicatedName: string;
  authorityOrdersDictum: string;
  notificationDate: Date;
  notifiedTo: string;
  placeNotification: string;
  confiscateDictamineDate: Date;
  dictaminationReturnDate: Date;
  alienationDate: Date;
  federalEntityKey: string;
  dictaminationDate: Date;
  registerNumber: string;
  destructionDate: Date;
  donationDate: Date;
  initialAgreementDate: Date;
  initialAgreement: string;
  expedientStatus: string;
  identifier: string;
  crimeStatus: string;
  transferNumber: string;
  expTransferNumber: string;
  expedientType: string;
  stationNumber: number | string;
  authorityNumber: number | string;
  insertionDatehc: Date;
}
export interface IExpedientMassiveUpload {
  id: string | number; // NO EXPEDIENTE
  insertedBy: string; // INSERTADO POR
  insertMethod: string; // METODO DE INSERCION
  insertDate: Date; //  FECHA DE INSERCION
  nameInstitution: string; // NOMBRE DE INSTITUCION
  indicatedName: string; // NOMBRE INDICIADO
  federalEntityKey: string; // CLAVE ENTIDAD FEDERATIVA
  identifier: string; // IDENTIFICADOR
  transferNumber: string; // NO TRANSFERENTE
  expTransferNumber: string; // NO EXPEDIENTES TRANSFERENTES
  expedientType: string; // TIPO DE EXPEDIENTE
  authorityNumber: number | string; //  NO DE AUTORIDAD
  stationNumber: number | string; // NO EMISORA
}
