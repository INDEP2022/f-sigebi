import {
  Identifier,
  NumDelegation,
  NumFile,
  NumTransfer,
} from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';

export class CaptureEventProceeding {
  id: string = null;
  keysProceedings: string = null;
  elaborationDate: string = null;
  datePhysicalReception: string = null;
  address: string = null;
  statusProceedings: string = null;
  elaborate: string = null;
  elaborateDetail?: { [key: string]: null | string } = null;
  numFile: number = null;
  witness1: string = null;
  witness2: string = null;
  typeProceedings: string = null;
  dateElaborationReceipt: string = null;
  dateDeliveryGood: string = null;
  responsible: string = null;
  destructionMethod: string = null;
  observations: string = null;
  approvedXAdmon: string = null;
  approvalDateXAdmon: string = null;
  approvalUserXAdmon: string = null;
  numRegister: string = null;
  captureDate: string = null;
  numDelegation1: string = null;
  numDelegation2: string = null;
  identifier: Identifier = null;
  label: string = null;
  universalFolio: string = null;
  numeraryFolio: string = null;
  numTransfer: NumTransfer = null;
  idTypeProceedings: string = null;
  receiptKey: string = null;
  comptrollerWitness: string = null;
  numRequest: string = null;
  closeDate: string = null;
  maxDate: string = null;
  indFulfilled: string = null;
  dateCaptureHc: string = null;
  dateCloseHc: string = null;
  dateMaxHc: string = null;
  receiveBy: string = null;
  affair: string = null;
  numDelegation_1?: NumDelegation = null;
  numDelegation_2?: NumDelegation = null;
  numDelegation1Description?: string = null;
  numDelegation2Description?: string = null;
  file?: NumFile = null;
}
