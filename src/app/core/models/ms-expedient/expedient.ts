export interface IExpedient {
  id: string | number;
  dateAgreementAssurance?: Date;
  foresight?: string;
  dateForesight?: Date;
  articleValidated?: Date;
  ministerialDate?: Date;
  ministerialActOfFaith?: string;
  date_Dictamines?: Date;
  batteryNumber?: string;
  lockerNumber?: string;
  shelfNumber?: string;
  courtNumber: number;
  observationsForecast?: string;
  insertedBy?: string;
  observations?: string;
  insertMethod?: string;
  insertDate?: Date | string;
  receptionDate?: Date;
  criminalCase: string;
  preliminaryInquiry: string;
  protectionKey: string;
  crimeKey: string;
  circumstantialRecord: string;
  keyPenalty: string;
  nameInstitution: string;
  courtName: string;
  mpName: string;
  keySaveValue?: string;
  indicatedName: string;
  authorityOrdersDictum?: string;
  notificationDate?: Date;
  notifiedTo?: string;
  placeNotification?: string;
  confiscateDictamineDate?: Date;
  dictaminationReturnDate?: Date;
  alienationDate?: Date;
  federalEntityKey: string;
  dictaminationDate?: Date;
  registerNumber?: string;
  destructionDate?: Date;
  donationDate?: Date;
  initialAgreementDate?: Date;
  initialAgreement?: string;
  expedientStatus?: string;
  identifier: string;
  crimeStatus?: string;
  transferNumber: number;
  expTransferNumber: string;
  expedientType: string;
  stationNumber: number | string;
  authorityNumber: number | string;
  insertionDatehc?: Date;
}
export interface IExpedientMassiveFromTmp {
  id: string | number;
  dateAgreementAssurance?: Date;
  foresight?: string;
  dateForesight?: Date;
  articleValidated?: Date | string;
  ministerialDate?: Date;
  ministerialActOfFaith?: string;
  date_Dictamines?: Date;
  batteryNumber?: string | number;
  lockerNumber?: string | number;
  shelfNumber?: string | number;
  courtNumber: number;
  observationsForecast?: string;
  insertedBy?: string;
  observations?: string;
  insertMethod?: string;
  insertDate?: Date | string;
  receptionDate?: Date;
  criminalCase: string;
  preliminaryInquiry: string;
  protectionKey: string | number;
  crimeKey: string;
  circumstantialRecord: string;
  keyPenalty: string;
  nameInstitution: string;
  courtName: string;
  mpName: string;
  keySaveValue?: string;
  indicatedName: string;
  authorityOrdersDictum?: string;
  notificationDate?: Date;
  notifiedTo?: string;
  placeNotification?: string;
  confiscateDictamineDate?: Date;
  dictaminationReturnDate?: Date;
  alienationDate?: Date;
  federalEntityKey: string;
  dictaminationDate?: Date;
  registerNumber?: string | number;
  destructionDate?: Date;
  donationDate?: Date;
  initialAgreementDate?: Date;
  initialAgreement?: string;
  expedientStatus?: string;
  identifier: string;
  crimeStatus?: string;
  transferNumber: number;
  expTransferNumber: string;
  expedientType: string;
  stationNumber: number | string;
  authorityNumber: number | string;
  insertionDatehc?: Date;
}
export interface IExpedientMassiveUpload {
  id: string | number; // NO EXPEDIENTE
  insertedBy: string; // INSERTADO POR
  insertMethod: string; // METODO DE INSERCION
  insertDate: string | Date; //  FECHA DE INSERCION
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

export interface IExpedientSami {
  id?: number;
  expedientDate?: string; //date
  creationUser?: string;
  creationDate?: string; //date
  modificationUser?: string;
  modificationDate?: string; //date
  courtNumber?: string;
  publicMinistry?: string;
  externalOfficeNumber?: string;
  help?: string;
  tocaPenal?: string;
  preliminaryInvestigationion?: string;
  criminalCase?: string;
  opinion?: string;
  indicated?: string;
  legalBasisInai?: string;
  reserveDateInai?: string; //date
  reserveTypeInai?: string;
  reservePeriodInai?: number;
  documentarySectionInai?: string;
  documentarySeriesInai?: string;
  clasificationInai?: string;
  documentaryValueInai?: string;
  vaProcedureInai?: number;
  vaConcentrationInai?: number;
  sheetsInai?: number;
  filesInai?: number;
  coverInai?: string;
  version?: number;
  inaiUser?: number;
  inaiUnit?: number;
  inaiFile?: number;
  provisionInai?: number;
  inaiOfficial?: number;
  fullCoding?: string;
  adminUnit?: string;
  endExpedientDate?: string; //string
}
