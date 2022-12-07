import { FormControl, Validators } from '@angular/forms';
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
  ['identifier', 'type'];

export const DOCUMENTS_RECEPTION_REGISTER_FORM = {
  type: new FormControl<string>(null, Validators.required),
  identifier: new FormControl<string>(null, Validators.required),
  sender: new FormControl<string | number>(null, Validators.required),
  subject: new FormControl<string | number>(null, Validators.required),
  reception: new FormControl<string | number>(null, Validators.required),
  priority: new FormControl<string | number>(null, Validators.required),
  flyer: new FormControl<string | number>(null, Validators.required),
  consecutive: new FormControl<string | number>(null, Validators.required),
  record: new FormControl<string | number>(null, Validators.required),
  recordId: new FormControl<string | number>(null),
  desalojov: new FormControl<boolean>(false),
  generalDirection: new FormControl<boolean>(false),
  judgmentType: new FormControl<string | number>(null),
  jobNumber: new FormControl<string | number>(null, Validators.required),
  jobDate: new FormControl<string | number>(null, Validators.required),
  description: new FormControl<string | number>(null, Validators.required),
  expTransfer: new FormControl<string | number>(null),
  uniqueKey: new FormControl<string | number>(null),
  city: new FormControl<string | number>(null, Validators.required),
  state: new FormControl<string | number>(null, Validators.required),
  transfer: new FormControl<string | number>(null, Validators.required),
  court: new FormControl<string | number>(null),
  transmitter: new FormControl<string | number>(null, Validators.required),
  autority: new FormControl<string | number>(null, Validators.required),
  taxpayer: new FormControl<string | number>(null, Validators.required),
  receptionWay: new FormControl<string | number>(null, Validators.required),
  destinationArea: new FormControl<string | number>(null, Validators.required),
  destinationManagement: new FormControl<string | number>(null),
  inAtention: new FormControl<string | number>(null, Validators.required),
  cpp: new FormControl<string | number>(null),
  status: new FormControl<string | number>(null, Validators.required),
};
