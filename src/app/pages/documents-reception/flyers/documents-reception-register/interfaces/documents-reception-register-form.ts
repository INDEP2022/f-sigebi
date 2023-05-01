import { FormControl, Validators } from '@angular/forms';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import {
  ITablesEntryData,
  TvalTable1Data,
} from 'src/app/core/models/catalogs/dinamic-tables.model';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ITransferingLevelView } from '../../../../../core/models/catalogs/transferente.model';
import { IUserAccessAreaRelational } from '../../../../../core/models/ms-users/seg-access-area-relational.model';
import { STRING_PATTERN } from '../../../../../core/shared/patterns';

// types
export type DocumentsReceptionRegister =
  typeof DOCUMENTS_RECEPTION_REGISTER_FORM;

export type DocuentsReceptionRegisterFormChanges = Partial<{
  [key in keyof DocumentsReceptionRegister]: (value: any) => void;
}>;

export type DocumentsReceptionRegisterFieldsToListen = Partial<
  (keyof DocumentsReceptionRegister)[]
>;

// constants
export const DOC_RECEPT_REG_FIELDS_TO_LISTEN: DocumentsReceptionRegisterFieldsToListen =
  [
    'identifier',
    'wheelType',
    // 'departamentDestinyNumber',
    'affairKey',
    'judgementType',
    'stage',
    'autorityNumber',
  ];

export const DOCUMENTS_RECEPTION_REGISTER_FORM = {
  wheelType: new FormControl<string>(null, Validators.required),
  identifier: new FormControl<IIdentifier>(null, Validators.required),
  externalRemitter: new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(60),
    Validators.pattern(STRING_PATTERN),
  ]),
  affairKey: new FormControl<string>(null, Validators.required),
  affair: new FormControl<string | number>(null, Validators.required),
  receiptDate: new FormControl<string | Date>(null, Validators.required),
  priority: new FormControl<string>('N', Validators.required),
  wheelNumber: new FormControl<number>(null),
  consecutiveNumber: new FormControl<number>(null),
  expedientNumber: new FormControl<number>(null),
  recordId: new FormControl<string | number>(null),
  identifierExp: new FormControl<string | number>(null),
  dailyEviction: new FormControl<boolean>(false),
  addressGeneral: new FormControl<boolean | number>(false),
  stage: new FormControl<string>(null),
  stageName: new FormControl<string>(null),
  circumstantialRecord: new FormControl<string>(null, [
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]),
  preliminaryInquiry: new FormControl<string>(null, [
    Validators.maxLength(200),
    Validators.pattern(STRING_PATTERN),
  ]),
  criminalCase: new FormControl<string>(null, [
    Validators.maxLength(40),
    Validators.pattern(STRING_PATTERN),
  ]),
  judgementType: new FormControl<string>(null),
  protectionKey: new FormControl<string>(null, [
    Validators.maxLength(100),
    Validators.pattern(STRING_PATTERN),
  ]),
  touchPenaltyKey: new FormControl<string>(null, [
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]),
  officeExternalKey: new FormControl<string>(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]),
  externalOfficeDate: new FormControl<string | Date>(null, Validators.required),
  observations: new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(1000),
    Validators.pattern(STRING_PATTERN),
  ]),
  expedientTransferenceNumber: new FormControl<string>(
    null,
    Validators.maxLength(150)
  ),
  uniqueKey: new FormControl<ITransferingLevelView>(null),
  cityNumber: new FormControl<ICity>(null, Validators.required),
  entFedKey: new FormControl<TvalTable1Data | ITablesEntryData>(
    null,
    Validators.required
  ),
  endTransferNumber: new FormControl<ITransferente>(null, Validators.required),
  transference: new FormControl<ITransferente>(null),
  courtNumber: new FormControl<ICourt>(null),
  stationNumber: new FormControl<IStation>(null, Validators.required),
  autorityNumber: new FormControl<IAuthority>(null, Validators.required),
  minpubNumber: new FormControl<IMinpub>(null),
  crimeKey: new FormControl<TvalTable1Data | ITablesEntryData>(
    null,
    Validators.required
  ),
  indiciadoNumber: new FormControl<IIndiciados>(null, Validators.required),
  viaKey: new FormControl<TvalTable1Data | ITablesEntryData>(
    null,
    Validators.required
  ),
  destinationArea: new FormControl<string | number>(null, Validators.required),
  departamentDestinyNumber: new FormControl<number>(null, Validators.required),
  delDestinyNumber: new FormControl<number>(null, Validators.required),
  delegationName: new FormControl<string>(null, Validators.required),
  subDelDestinyNumber: new FormControl<number>(null, Validators.required),
  subDelegationName: new FormControl<string>(null, Validators.required),
  estatusTramite: new FormControl<IManagementArea>(null, Validators.required),
  goodRelation: new FormControl<string>(null),
  institutionNumber: new FormControl<number>(200, Validators.required),
  institutionName: new FormControl<string>(null),
  officeNumber: new FormControl<number>(null),
  captureDate: new FormControl<Date | string>(new Date()),
  wheelStatus: new FormControl<string>(null),
  entryProcedureDate: new FormControl<Date | string>(new Date()),
  registerNumber: new FormControl<number>(null),
  originNumber: new FormControl<number>(null),
  dictumKey: new FormControl<string>(null),
  reserved: new FormControl<string>(null),
  autoscan: new FormControl<string>(null),
};

export interface IDocumentsReceptionData {
  wheelType: string;
  identifier: string;
  externalRemitter: string;
  affairKey: string;
  affair: string | number;
  receiptDate: string | Date;
  priority: string;
  wheelNumber: number;
  consecutiveNumber: number;
  expedientNumber: number;
  recordId?: string | number;
  identifierExp?: string | number;
  dailyEviction: number;
  addressGeneral: number;
  stage?: string;
  stageName?: string;
  circumstantialRecord: string;
  preliminaryInquiry: string;
  criminalCase: string;
  judgementType: string;
  protectionKey: string;
  touchPenaltyKey: string;
  officeExternalKey: string;
  externalOfficeDate: string | Date;
  observations: string;
  expedientTransferenceNumber: string;
  uniqueKey?: string | number;
  cityNumber: number;
  entFedKey: string;
  entFedDescription: string;
  endTransferNumber: number;
  transference: number;
  courtNumber: number;
  courtName: string;
  stationNumber: number;
  autorityNumber: number;
  minpubNumber: number;
  minpubName: string;
  crimeKey: string;
  indiciadoNumber: number;
  indiciadoName: string;
  viaKey: string;
  destinationArea: string | number;
  departamentDestinyNumber: number;
  delDestinyNumber: number;
  delegationName: string;
  subDelDestinyNumber: number;
  subDelegationName: string;
  estatusTramite: string;
  goodRelation?: string;
  institutionNumber: number;
  institutionName: string;
  officeNumber: number;
  captureDate: string | Date;
  wheelStatus: string;
  entryProcedureDate: string | Date;
  registerNumber?: number;
  originNumber: number;
  dictumKey: string;
  reserved: string;
  autoscan?: string;
}

export interface IDocumentsReceptionRegisterForm {
  wheelType: string;
  identifier: IIdentifier;
  externalRemitter: string;
  affairKey: string;
  affair: string | number;
  receiptDate: string | Date;
  priority: string;
  wheelNumber: number;
  consecutiveNumber: number;
  expedientNumber: number;
  recordId: string | number;
  identifierExp: string | number;
  dailyEviction: boolean;
  addressGeneral: boolean | number;
  stage: string;
  stageName: string;
  circumstantialRecord: string;
  preliminaryInquiry: string;
  criminalCase: string;
  judgementType: string;
  protectionKey: string;
  touchPenaltyKey: string;
  officeExternalKey: string;
  externalOfficeDate: string | Date;
  observations: string;
  expedientTransferenceNumber: string;
  uniqueKey: ITransferingLevelView;
  cityNumber: ICity;
  entFedKey: TvalTable1Data | ITablesEntryData;
  endTransferNumber: ITransferente;
  transference: ITransferente;
  courtNumber: ICourt;
  stationNumber: IStation;
  autorityNumber: IAuthority;
  minpubNumber: IMinpub;
  crimeKey: TvalTable1Data | ITablesEntryData;
  indiciadoNumber: IIndiciados;
  viaKey: TvalTable1Data | ITablesEntryData;
  destinationArea: string | number;
  departamentDestinyNumber: number;
  delDestinyNumber: number;
  delegationName: string;
  subDelDestinyNumber: number;
  subDelegationName: string;
  estatusTramite: IManagementArea;
  goodRelation: string;
  institutionNumber: number;
  institutionName: string;
  officeNumber: number;
  captureDate: Date | string;
  wheelStatus: string;
  entryProcedureDate: Date | string;
  registerNumber: number;
  originNumber: number;
  dictumKey: string;
  reserved: string;
  autoscan: string;
}

export const DOCUMENTS_RECEPTION_REGISTER_FORM_DEFAULT_VALUES = {
  priority: 'N',
  dailyEviction: false,
  addressGeneral: false,
  institutionNumber: 200,
  captureDate: new Date(),
  entryProcedureDate: new Date(),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM = {
  copyNumber: new FormControl<string | number>(1, Validators.required),
  copyuser: new FormControl<IUserAccessAreaRelational>(
    null,
    Validators.required
  ),
  persontype: new FormControl<string>('D', Validators.required),
  flierNumber: new FormControl<string | number>(null),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM = {
  copyNumber: new FormControl<string | number>(2),
  copyuser: new FormControl<IUserAccessAreaRelational>(null),
  persontype: new FormControl<string>('C'),
  flierNumber: new FormControl<string | number>(null),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_DEFAULT_VALUES = {
  copyNumber: 1,
  persontype: 'D',
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_DEFAULT_VALUES = {
  copyNumber: 2,
  persontype: 'C',
};
export interface IDocumentsReceptionUserForm {
  copyNumber: string | number;
  copyuser: IUserAccessAreaRelational;
  persontype: string;
  flierNumber: string | number;
}

export enum TaxpayerLabel {
  Taxpayer = 'Contribuyente',
  Defendant = 'Indiciado',
}

export enum InitialCondition {
  administrative = 'A',
  procedure = 'P',
  adminTransfer = 'AT',
  transferor = 'T',
}

export enum ProcedureStatus {
  pending = 'PENDIENTE',
  sent = 'ENVIADO',
}

export interface IGlobalFlyerRegistration {
  gNoExpediente: number | string | null; //Puede ser null porque el endpoint no deberia requerirlo para crear expediente
  noVolante: number | null;
  bn: number | null;
  gCreaExpediente: string | null;
  gstMensajeGuarda: string | null;
  gnuActivaGestion: number | null;
  antecede: number | null;
  pSatTipoExp: string | number | null;
  pIndicadorSat: string | number | null;
  gLastCheck: number | null;
  vTipoTramite: number | null;
  gCommit: string | number;
  gOFFCommit: string | number;
  noTransferente: string | number;
  gNoVolante: string | number;
}

export interface IDocReceptionFlyersRegistrationParams {
  pGestOk: number;
  pNoVolante: number;
  pSatTipoExp: string;
  pNoTramite: number;
  noTransferente: number;
  pIndicadorSat: number;
}

export interface IGoodsBulkLoadSatSaeParams {
  asuntoSat: string;
  pNoExpediente: number;
  pNoOficio: string;
  pNoVolante: number;
  pSatTipoExp: string;
  pIndicadorSat: number;
}

export interface IGoodsBulkLoadPgrSaeParams {
  pNoExpediente: number;
  pNoVolante: number;
  pAvPrevia: string;
}

export interface IGoodsCaptureTempParams {
  iden: string;
  noTransferente: number;
  desalojo: number;
  pNoVolante: number;
  pNoOficio: string;
  asuntoSat: string;
}
