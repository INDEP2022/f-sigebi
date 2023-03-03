import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';

export interface IProceedingInfo {
  id: number;
  numFile: number;
  cveActa: string;
  tipoActa: string;
  labelActa: string;
  receiptKey: string;
  statusActa: string;
  address: string;
  observations: string;
  numDelegation1: string;
  numDelegation2: string;
  elaborationDate: string;
  closeDate: string;
  datePhysicalReception: string;
  maxDate: string;
  dateElaborationReceipt: string;
  dateCaptureHc: string;
  dateDeliveryGood: string;
  dateCloseHc: string;
  captureDate: string;
  dateMaxHc: string;
  witness1: string;
  witness2: string;
  comptrollerWitness: string;
}

export function deliveryReceptionToInfo(
  item: IProceedingDeliveryReception
): IProceedingInfo {
  return {
    id: +item.id,
    numFile: item.numFile.filesId,
    cveActa: item.keysProceedings,
    tipoActa: item.typeProceedings,
    labelActa: item.label,
    receiptKey: item.receiptKey,
    statusActa: item.statusProceedings,
    address: item.address,
    observations: item.observations,
    numDelegation1: item.numDelegation1,
    numDelegation2: item.numDelegation2,
    elaborationDate: item.elaborationDate,
    closeDate: item.closeDate,
    datePhysicalReception: item.datePhysicalReception,
    maxDate: item.maxDate,
    dateElaborationReceipt: item.dateElaborationReceipt,
    dateCaptureHc: item.dateCaptureHc,
    dateDeliveryGood: item.dateDeliveryGood,
    dateCloseHc: item.dateCloseHc,
    captureDate: item.captureDate,
    dateMaxHc: item.dateMaxHc,
    witness1: item.witness1,
    witness2: item.witness2,
    comptrollerWitness: item.comptrollerWitness,
  };
}
