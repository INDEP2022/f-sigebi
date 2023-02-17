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
  ['identifier', 'wheelType'];

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
  dailyEviction: new FormControl<boolean | number>(false),
  addressGeneral: new FormControl<boolean | number>(false),
  stage: new FormControl<string>(null, Validators.required),
  circumstantialRecord: new FormControl<string | number>(
    null,
    Validators.required
  ),
  preliminaryInquiry: new FormControl<string | number>(
    null,
    Validators.required
  ),
  criminalCase: new FormControl<string | number>(null, Validators.required),
  protectionKey: new FormControl<string | number>(null, Validators.required),
  touchPenaltyKey: new FormControl<string | number>(null),
  officeExternalKey: new FormControl<string | number>(
    null,
    Validators.required
  ),
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
  estatusTramite: new FormControl<IManagementArea>(null),
  goodRelation: new FormControl<string>(null),
  institutionNumber: new FormControl<string | number>(null),
  officeNumber: new FormControl<string | number>(null),
  captureDate: new FormControl<string | number | Date>(null),
  wheelStatus: new FormControl<string>(null),
  entryProcedureDate: new FormControl<string | number | Date>(null),
  registerNumber: new FormControl<string | number>(null),
  originNumber: new FormControl<string | number>(null),
  dictumKey: new FormControl<string | number>(null),
  reservado: new FormControl<string>(null),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_RECIPIENT_FORM = {
  copyNumber: new FormControl<string | number>(1, Validators.required),
  copyuser: new FormControl<IUserAccessAreas>(null, Validators.required),
  persontype: new FormControl<string>('D', Validators.required),
  flierNumber: new FormControl<string | number>(null, Validators.required),
  registryNumber: new FormControl<string | number>(null, Validators.required),
};

export const DOCUMENTS_RECEPTION_FLYER_COPIES_CPP_FORM = {
  copyNumber: new FormControl<string | number>(2, Validators.required),
  copyuser: new FormControl<IUserAccessAreas>(null),
  persontype: new FormControl<string>('C', Validators.required),
  flierNumber: new FormControl<string | number>(null, Validators.required),
  registryNumber: new FormControl<string | number>(null, Validators.required),
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
