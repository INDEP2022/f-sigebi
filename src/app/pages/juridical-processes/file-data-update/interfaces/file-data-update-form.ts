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
import {
  ITransferente,
  ITransferingLevelView,
} from 'src/app/core/models/catalogs/transferente.model';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { IAffair } from '../../../../core/models/catalogs/affair.model';
import { IIssuingInstitution } from '../../../../core/models/catalogs/issuing-institution.model';
import { IOpinion } from '../../../../core/models/catalogs/opinion.model';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

export type JuridicalFileUpdate = typeof JURIDICAL_FILE_DATA_UPDATE_FORM;

export type FileDataUpdateFieldsToListen = Partial<
  (keyof JuridicalFileUpdate)[]
>;

export const FILE_DATA_UPDATE_SEARCH_FIELDS: FileDataUpdateFieldsToListen = [
  'identifier',
  'wheelType',
  'departamentDestinyNumber',
  'affairKey',
  'judgementType',
  'stage',
  'autorityNumber',
];

export const FILE_DATA_UPDATE_ENABLED_FIELDS: FileDataUpdateFieldsToListen = [
  'identifier',
  'wheelType',
  'departamentDestinyNumber',
  'affairKey',
  'judgementType',
  'stage',
  'autorityNumber',
];

export const JURIDICAL_FILE_DATA_UPDATE_FORM = {
  wheelType: new FormControl<string>(null),
  identifier: new FormControl<IIdentifier>(null),
  externalRemitter: new FormControl<string>(null, [
    Validators.maxLength(60),
    Validators.pattern(STRING_PATTERN),
  ]),
  affairKey: new FormControl<IAffair>(null),
  affair: new FormControl<string | number>(null, Validators.required),
  receiptDate: new FormControl<string | Date>(null),
  priority: new FormControl<string>(null),
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
    Validators.maxLength(35),
    Validators.pattern(STRING_PATTERN),
  ]),
  externalOfficeDate: new FormControl<string | Date>(null),
  observations: new FormControl<string>(null, [
    Validators.maxLength(1000),
    Validators.pattern(STRING_PATTERN),
  ]),
  expedientTransferenceNumber: new FormControl<string>(
    null,
    Validators.maxLength(150)
  ),
  uniqueKey: new FormControl<ITransferingLevelView>(null),
  cityNumber: new FormControl<ICity>(null),
  entFedKey: new FormControl<TvalTable1Data | ITablesEntryData>(null),
  endTransferNumber: new FormControl<ITransferente>(null),
  transference: new FormControl<number>(null),
  courtNumber: new FormControl<ICourt>(null),
  stationNumber: new FormControl<IStation>(null),
  autorityNumber: new FormControl<IAuthority>(null),
  minpubNumber: new FormControl<IMinpub>(null),
  crimeKey: new FormControl<TvalTable1Data | ITablesEntryData>(null),
  indiciadoNumber: new FormControl<IIndiciados>(null),
  viaKey: new FormControl<TvalTable1Data | ITablesEntryData>(null),
  destinationArea: new FormControl<string | number>(null),
  departamentDestinyNumber: new FormControl<number>(null),
  delDestinyNumber: new FormControl<number>(null),
  delegationName: new FormControl<string>(null),
  subDelDestinyNumber: new FormControl<number>(null),
  subDelegationName: new FormControl<string>(null),
  estatusTramite: new FormControl<IManagementArea>(null),
  goodRelation: new FormControl<string>(null),
  institutionNumber: new FormControl<IIssuingInstitution>(null),
  institutionName: new FormControl<string>(null),
  officeNumber: new FormControl<number>(null),
  captureDate: new FormControl<Date | string>(new Date()),
  wheelStatus: new FormControl<string>(null),
  entryProcedureDate: new FormControl<Date | string>(new Date()),
  registerNumber: new FormControl<number>(null),
  originNumber: new FormControl<number>(null),
  dictumKey: new FormControl<IOpinion>(null, Validators.required),
  reserved: new FormControl<string>(null, Validators.required),
  autoscan: new FormControl<string>(null),
  userRecipient: new FormControl<string>(null),
};

export interface IJuridicalFileDataUpdateForm {
  wheelType: string;
  identifier: IIdentifier;
  externalRemitter: string;
  affairKey: IAffair;
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
  transference: number;
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
  institutionNumber: IIssuingInstitution;
  institutionName: string;
  officeNumber: number;
  captureDate: Date | string;
  wheelStatus: string;
  entryProcedureDate: Date | string;
  registerNumber: number;
  originNumber: number;
  dictumKey: IOpinion;
  reserved: string;
  autoscan: string;
  userRecipient: string;
}
