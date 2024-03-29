export interface IDocuments {
  id?: string | number;
  natureDocument: string;
  descriptionDocument?: string;
  significantDate: Date | string;
  scanStatus: string;
  fileStatus?: string;
  userRequestsScan?: string;
  scanRequestDate?: Date;
  userRegistersScan?: string;
  dateRegistrationScan?: Date;
  userReceivesFile?: string;
  dateReceivesFile?: Date;
  keyTypeDocument?: string;
  keySeparator?: string | number;
  numberProceedings?: string | number;
  sheets?: string;
  numberDelegationRequested?: string | number;
  numberSubdelegationRequests?: string | number;
  numberDepartmentRequest?: string | number;
  registrationNumber?: string | number;
  flyerNumber?: string | number;
  userSend?: string;
  areaSends?: string;
  sendDate?: Date;
  sendFilekey?: string;
  userResponsibleFile?: string;
  mediumId?: string;
  associateUniversalFolio?: string | number;
  dateRegistrationScanningHc?: Date;
  dateRequestScanningHc?: Date;
  goodNumber?: string | number;
}

export interface IDocumentsGood {
  cve_documento?: string | number;
  descripcion?: string | number;
  tipo_dictaminacion?: string | number;
  no_registro?: string | number;
  nb_origen?: string | number;
  no_bien?: string | number;
}
