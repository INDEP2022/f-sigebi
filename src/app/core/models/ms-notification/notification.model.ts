import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

export interface INotificationXProperty {
  numberProperty: number | string;
  notificationDate: Date | string;
  notifiedTo: string;
  notifiedPlace: string;
  duct: string;
  editPublicationDate: Date | string;
  newspaperPublication: Date | string;
  insertMethod: string;
  periodEndDate: Date | string;
  observation: string;
  abandonmentExpirationDate: Date | string;
  registerNumber: number;
  nameInstitutionNotified: string;
  namePersonNotified: string;
  positionPersonNotified: string;
  statusNotified: string;
  responseNotifiedDate: Date | string;
  resolutionDescription: string;
  temporarySuspension: Date | string;
  definitiveSuspension: Date | string;
  userCorrectsKey: string;
}

export interface INotification {
  wheelNumber: number;
  receiptDate: Date | string;
  captureDate: Date | string;
  officeExternalKey: string;
  externalOfficeDate: Date | string;
  externalRemitter: string;
  protectionKey: string;
  touchPenaltyKey: string;
  circumstantialRecord: string;
  preliminaryInquiry: string;
  criminalCase: string;
  addressee?: string;
  expedientNumber: number;
  crimeKey: string;
  affairKey: string;
  entFedKey: string;
  viaKey: string;
  consecutiveNumber: number;
  observations: string;
  delegationNumber: number;
  subDelegationNumber: number;
  institutionNumber: IInstitutionNumber | number;
  indiciadoNumber: number;
  delDestinyNumber: number;
  subDelDestinyNumber: number;
  departamentDestinyNumber: number;
  officeNumber: number;
  minpubNumber: number | IMinpub;
  cityNumber: number;
  courtNumber: number;
  registerNumber?: number;
  dictumKey: string;
  identifier: string;
  observationDictum?: string;
  wheelStatus: string;
  transference: number;
  expedientTransferenceNumber: string;
  priority: string;
  wheelType: string;
  reserved: string;
  entryProcedureDate: Date | string;
  userInsert?: string;
  originNumber: number;
  stationNumber: number;
  autorityNumber: number;
  endTransferNumber: number;
  dailyEviction: number;
  hcCaptureDate?: Date | string;
  hcEntryProcedureDate?: Date;
  desKnowingDate?: Date;
  addressGeneral: number;
  affair?: IAffair | null;
  delegation?: null | IDelegation;
  subDelegation?: null | ISubdelegation;
  departament?: null | IDepartment;
  numberProperty?: number;
  notificationDate?: any;
  userCorrectsKey?: any;
}

export interface IAffair {
  id: number;
  description: string;
  referralNoteType: string;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  versionUser: string;
  status: string;
  registerNumber: number;
  version: string;
  processDetonate: string;
  clv: string;
}

export interface IInstitutionNumber {
  id: number;
  name: string;
  description: string;
  manager: string;
  street: string;
  numInside: string;
  numExterior: string;
  cologne: string;
  zipCode: string;
  delegMunic: string;
  phone: string;
  numClasif: number;
  numCity: string;
  idCity: number;
  numRegister: string;
  numTransference: string;
}

export interface INotificationInquiry {
  protectionKey: string;
  touchPenaltyKey: string;
  circumstantialRecord: string;
  preliminaryInquiry: string;
  criminalCase: string;
  entFedKey: string;
  indiciadoNumber: number;
  minpubNumber: number | string;
  cityNumber: number;
  courtNumber: number | string;
  transference: number;
  stationNumber: number;
  autorityNumber: number;
}

export interface INotificationTransferentIndiciadoCityGetData {
  city: number;
  indiciado: number;
  transferent: number;
}

export interface ItVolanteNotificacionesByNoExpedient {
  wheel: string;
}

export interface INotificationTransferentIndiciadoCity {
  wheelNumber: string;
  receiptDate: string;
  captureDate: string;
  officeExternalKey: string;
  externalOfficeDate: string;
  externalRemitter: string;
  protectionKey: string;
  touchPenaltyKey: string;
  circumstantialRecord: string;
  preliminaryInquiry: string;
  criminalCase: string;
  addressee: string;
  expedientNumber: string;
  crimeKey: string;
  affairKey: string;
  entFedKey: string;
  viaKey: string;
  consecutiveNumber: string;
  observations: string;
  delegationNumber: string;
  subDelegationNumber: string;
  institutionNumber: {
    id: string;
    name: string;
    description: string;
    manager: string;
    street: string;
    numInside: string;
    numExterior: string;
    cologne: string;
    zipCode: string;
    delegMunic: string;
    phone: string;
    numClasif: string;
    numCity: string;
    idCity: string;
    numRegister: string;
    numTransference: string;
  };
  indiciadoNumber: string;
  delDestinyNumber: string;
  subDelDestinyNumber: string;
  departamentDestinyNumber: string;
  officeNumber: string;
  minpubNumber: {
    id: string;
    descripcion: string;
    responsable: string;
    calle: string;
    no_interior: string;
    no_exterior: string;
    colonia: string;
    codigo_postal: string;
    deleg_munic: string;
    no_ciudad: string;
    idCity: string;
    telefono: string;
    no_registro: string;
  };
  cityNumber: string;
  courtNumber: string;
  registerNumber: string;
  dictumKey: string;
  identifier: string;
  observationDictum: string;
  wheelStatus: string;
  transference: string;
  expedientTransferenceNumber: string;
  priority: string;
  wheelType: string;
  reserved: string;
  entryProcedureDate: string;
  userInsert: string;
  originNumber: string;
  stationNumber: string;
  autorityNumber: string;
  endTransferNumber: string;
  dailyEviction: string;
  hcCaptureDate: string;
  hcEntryProcedureDate: string;
  desKnowingDate: string;
  addressGeneral: string;
  affair: {
    id: string;
    description: string;
    referralNoteType: string;
    creationUser: string;
    creationDate: string;
    editionUser: string;
    modificationDate: string;
    versionUser: string;
    status: string;
    registerNumber: string;
    version: string;
    processDetonate: string;
    clv: string;
  };
  delegation: {
    id: string;
    etapaEdo: string;
    stateKey: string;
    description: string;
    addressOffice: string;
    regionalDelegate: string;
    zoneKey: string;
    city: string;
    status: string;
    iva: string;
    noRegister: string;
    zoneContractKey: string;
    zoneVigilanceKey: string;
    diffHours: string;
    version: string;
    creationUser: string;
    creationDate: string;
    editionUser: string;
    modificationDate: string;
    idZoneGeographic: string;
  };
  subDelegation: {
    id: string;
    phaseEdo: string;
    delegationNumber: string;
    description: string;
    dailyConNumber: string;
    dateDailyCon: string;
    registerNumber: string;
  };
  departament: {
    id: string;
    numDelegation: string;
    numSubDelegation: string;
    phaseEdo: string;
    dsarea: string;
    description: string;
    lastOffice: string;
    numRegister: string;
    level: string;
    depend: string;
    depDelegation: string;
  };
}

export interface INotificationDictum {
  dictumKey: string;
}
