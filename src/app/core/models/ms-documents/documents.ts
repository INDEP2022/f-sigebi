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

export interface ICaptureDigViewHistoryIndicators {
  // no_expediente: number;
  // desalojo_diadia: number;
  // finicia: string;
  // coordinacion_regional: number;
  // urecepcion: string;
  // cve_asunto: string;
  // tipo_volante: string;
  // no_transferente: number;
  // no_emisora: number;
  // no_autoridad: number;
  // cve_oficio_externo: string;
  // no_volante: number;
  // no_tramite: number;
  // ufinaliza: string;
  // fescaneo: string;
  // fmaxima: string;
  // cant_bien: number;
  // tipo_tramite: number;
  // cantidad: number;

  //

  fileNumber: number;
  evictionToday: number;
  startDate: string;
  regionalCoordination: number;
  receptionUnit: string;
  subjectCode: string;
  flyerType: string;
  transferorNumber: number;
  emissaryNumber: number;
  authorityNumber: number;
  externalLetterCode: string;
  flyerNumber: number;
  procedureNumber: number;
  endDate: string;
  scanningDate: string;
  maximumDate: string;
  quantityGoods: number;
  procedureType: number;
  quantity: number;
}

export interface ICaptureHistoryIndicators {
  num: number;
  id: string;
  proceedingsNum: number;
  flierNum: number;
  userWorks: string;
  admissionDate: string;
  workDate: string;
  maxDate: string;
  complied: string;
  daysNum: number;
}

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
