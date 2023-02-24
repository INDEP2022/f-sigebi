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
import { IUserAccessAreas } from '../../../../../core/models/ms-users/users-access-areas-model';
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
    'departamentDestinyNumber',
    'affairKey',
    'judgementType',
    'stage',
    'autorityNumber',
  ];

export const DOCUMENTS_RECEPTION_REGISTER_FORM = {
  wheelType: new FormControl<string>(null, Validators.required),
  identifier: new FormControl<IIdentifier>(null, Validators.required),
  externalRemitter: new FormControl<string | number>(null, Validators.required),
  affairKey: new FormControl<string | number>(null, Validators.required),
  affair: new FormControl<string | number>(null, Validators.required),
  receiptDate: new FormControl<string | number | Date>(
    null,
    Validators.required
  ),
  priority: new FormControl<string | number>(null, Validators.required),
  wheelNumber: new FormControl<string | number>(null),
  consecutiveNumber: new FormControl<string | number>(null),
  expedientNumber: new FormControl<string | number>(null),
  recordId: new FormControl<string | number>(null),
  identifierExp: new FormControl<string | number>(null),
  dailyEviction: new FormControl<boolean | number>(false),
  addressGeneral: new FormControl<boolean | number>(false),
  stage: new FormControl<string>(null),
  stageName: new FormControl<string>(null),
  circumstantialRecord: new FormControl<string | number>(null),
  preliminaryInquiry: new FormControl<string | number>(null),
  criminalCase: new FormControl<string | number>(null),
  judgementType: new FormControl<string>(null),
  protectionKey: new FormControl<string | number>(null),
  touchPenaltyKey: new FormControl<string | number>(null),
  officeExternalKey: new FormControl<string>(null, Validators.required),
  externalOfficeDate: new FormControl<string | number | Date>(
    null,
    Validators.required
  ),
  observations: new FormControl<string | number>(null, Validators.required),
  expedientTransferenceNumber: new FormControl<string | number>(null),
  uniqueKey: new FormControl<string | number>(null),
  cityNumber: new FormControl<ICity>(null, Validators.required),
  entFedKey: new FormControl<TvalTable1Data | ITablesEntryData>(
    null,
    Validators.required
  ),
  endTransferNumber: new FormControl<ITransferente>(null, Validators.required),
  transference: new FormControl<string | number>(null, Validators.required),
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
  departamentDestinyNumber: new FormControl<string | number>(
    null,
    Validators.required
  ),
  delegationNumber: new FormControl<string | number>(null, Validators.required),
  delegationName: new FormControl<string>(null, Validators.required),
  subDelegationNumber: new FormControl<string | number>(
    null,
    Validators.required
  ),
  subDelegationName: new FormControl<string>(null, Validators.required),
  estatusTramite: new FormControl<IManagementArea>(null, Validators.required),
  goodRelation: new FormControl<string>(null),
  institutionNumber: new FormControl<string | number>(200, Validators.required),
  officeNumber: new FormControl<string | number>(null),
  captureDate: new FormControl<string | number | Date>(null),
  wheelStatus: new FormControl<string>(null),
  entryProcedureDate: new FormControl<string | number | Date>(new Date()),
  registerNumber: new FormControl<string | number>(null),
  originNumber: new FormControl<string | number>(null),
  dictumKey: new FormControl<string | number>(null),
  reserved: new FormControl<string>(null),
  autoscan: new FormControl<string>(null),
};

export interface IDocumentsReceptionData {
  wheelType: string;
  identifier: string | number;
  externalRemitter: string | number;
  affairKey: string | number;
  affair: string | number;
  receiptDate: string | number | Date;
  priority: string | number;
  wheelNumber?: string | number;
  consecutiveNumber?: string | number;
  expedientNumber?: string | number;
  recordId?: string | number;
  identifierExp?: string | number;
  dailyEviction?: boolean | number;
  addressGeneral?: boolean | number;
  stage?: string;
  stageName?: string;
  circumstantialRecord?: string | number;
  preliminaryInquiry?: string | number;
  criminalCase?: string | number;
  judgementType?: string;
  protectionKey?: string | number;
  touchPenaltyKey?: string | number;
  officeExternalKey: string;
  externalOfficeDate: string | number | Date;
  observations: string | number;
  expedientTransferenceNumber?: string | number;
  uniqueKey?: string | number;
  cityNumber: string | number;
  entFedKey: string | number;
  endTransferNumber: string | number;
  transference: string | number;
  courtNumber?: string | number;
  stationNumber: string | number;
  autorityNumber: string | number;
  minpubNumber?: string | number;
  crimeKey: string | number;
  indiciadoNumber: string | number;
  viaKey: string | number;
  destinationArea: string | number;
  departamentDestinyNumber: string | number;
  delegationNumber: string | number;
  delegationName: string | number;
  subDelegationNumber: string | number;
  subDelegationName: string | number;
  estatusTramite: string | number;
  goodRelation?: string;
  institutionNumber: string | number;
  officeNumber?: string | number;
  captureDate?: string | number | Date;
  wheelStatus?: string;
  entryProcedureDate?: string | number | Date;
  registerNumber?: string | number;
  originNumber?: string | number;
  dictumKey?: string | number;
  reserved?: string;
  autoscan?: string;
}

export const DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM = {
  copyNumber: new FormControl<string | number>(1, Validators.required),
  copyuser: new FormControl<IUserAccessAreas>(null, Validators.required),
  persontype: new FormControl<string>('D', Validators.required),
  flierNumber: new FormControl<string | number>(null),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM = {
  copyNumber: new FormControl<string | number>(2),
  copyuser: new FormControl<IUserAccessAreas>(null),
  persontype: new FormControl<string>('C'),
  flierNumber: new FormControl<string | number>(null),
};

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
}

export interface IDocReceptionFlyersRegistrationParams {
  pGestOk: number | null;
  pNoVolante: number | null;
  pSatTipoExp: string | null; //No necesario si existe global
  pNoTramite: number | null;
}

export type FlyersRegistrationParamName = Partial<
  keyof IDocReceptionFlyersRegistrationParams
>;
