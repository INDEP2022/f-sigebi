export interface IProccedingsDeliveryReception {
  id?: number;
  keysProceedings?: string;
  elaborationDate?: number;
  datePhysicalReception?: number;
  address?: string;
  statusProceedings?: string;
  elaborate?: string;
  numFile?: number;
  witness1?: string;
  witness2?: string;
  typeProceedings?: string;
  dateElaborationReceipt?: number;
  dateDeliveryGood?: number;
  responsible?: string;
  destructionMethod?: string;
  observations?: string;
  approvedXAdmon?: string;
  approvalDateXAdmon?: number;
  approvalUserXAdmon?: string;
  numRegister?: number;
  captureDate?: number;
  numDelegation1?: number | string;
  numDelegation2?: number | string;
  identifier?: string;
  label?: string;
  universalFolio?: number;
  numeraryFolio?: number;
  numTransfer?: number;
  idTypeProceedings?: string;
  receiptKey?: string;
  comptrollerWitness?: string;
  numRequest?: number;
  closeDate?: number;
  maxDate?: number;
  indFulfilled?: number;
  dateCaptureHc?: number;
  dateCloseHc?: number;
  dateMaxHc?: number;
  receiveBy?: string;
  affair?: string;
}
