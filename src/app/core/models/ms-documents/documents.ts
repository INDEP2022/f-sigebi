import { IExpedient } from '../ms-expedient/expedient';

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

export interface IGenerateFolioMassConv {
  noPackage: number;
  cvePackage: number;
  typePackage: number;
  noDelegation: number;
  noSubdelegation: number;
  toolbarNoDepartament: number;
  user: string;
}

export interface ICatDigitalizationTemp {
  flyerNumber: number;
  proceedingsNumber: number;
  indicatorNumber: number;
  managementNumber: number;
  area: string;
  flyerType: string;
  cveAffair: string;
  transfereeNumber: number;
  stationNumber: number;
  authorityNumber: number;
  cveJobExternal: string;
  jobNumber: number;
  flyerDate: Date;
  cveOpinion: string;
  coordinationRegional: string;
  evictionDay: string;
  ureception: string;
  freception: string;
  ustart: string;
  finicia: string;
  uends: string;
  ends: string;
  fscan: string;
  fmaxima: string;
  ffinind: string;
  user: string;
  recordNumber?: number;
  complied?: string;
}

export interface ICaptureDig {
  regionalCoordination: number;
  externalLetterCode: string;
  fileNumber: IExpedient;
  flyerNumber: number;
  procedureNumber: number;
  receptionUnit: number;
  // programa: string;
  scanningDate: string;
  quantityGoods: number;
  startDate: string;
  maximumDate: string;
  cumplio: boolean;
  column5: string;
}

export interface ICaptureHistoryIndicators {
  num: number;
  indicador: string;
  no_expediente: number;
  no_volante: number;
  usr_trabaja: string;
  fec_ingreso: string;
  fec_trabajo: string;
  fecha_max: string;
  cumplio: string;
  no_dias: number;
}

// @Injectable()
// export class CaptureDig {
//   coordinacion_regional: number;
//   cve_oficio_externo: string;
//   no_expediente: IExpedient;
//   no_volante: number;
//   no_tramite: number;
//   urecepcion: number;
//   programa: string;
//   fescaneo: string;
//   cant_bien: number;
//   finicia: string;
//   fmaxima: string;
//   cumplio: boolean;
//   column5: string;
//   image: string;
// }

export interface ICaptureDigFilter {
  cveJobExternal: string;
  user: string;
  cvCoors: number[];
  typeSteering: string;
  fecStart: string;
  fecEnd: string;
  noTransfere: number;
  noStation: number;
  noAuthorityts: number;
}
export interface Info {
  total_cumplio: number;
  total_no_cumplio: number;
  porcen_cumplidos: number;
}
