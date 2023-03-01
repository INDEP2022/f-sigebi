import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';

export interface IProceedingInfo {
  numActa: number;
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
    numActa: +item.id,
    numFile: item.numFile.filesId,
    cveActa: item.keysProceedings,
    tipoActa: item.typeProceedings,
    labelActa: string,
    receiptKey: string,
    statusActa: string,
    address: string,
    observations: string,
    numDelegation1: string,
    numDelegation2: string,
    elaborationDate: string,
    closeDate: string,
    datePhysicalReception: string,
    maxDate: string,
    dateElaborationReceipt: string,
    dateCaptureHc: string,
    dateDeliveryGood: string,
    dateCloseHc: string,
    captureDate: string,
    dateMaxHc: string,
    witness1: string,
    witness2: string,
    comptrollerWitness: string,
  };
}
