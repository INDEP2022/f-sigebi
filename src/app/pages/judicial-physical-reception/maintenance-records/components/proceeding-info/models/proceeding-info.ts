import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { firstFormatDate, formatForIsoDate } from 'src/app/shared/utils/date';

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
  numDelegation1Description?: string;
  numDelegation2: string;
  numDelegation2Description?: string;
  elaborationDate: any;
  closeDate: any;
  datePhysicalReception: any;
  maxDate: any;
  dateElaborationReceipt: any;
  dateCaptureHc: any;
  dateDeliveryGood: any;
  dateCloseHc: any;
  captureDate: any;
  dateMaxHc: any;
  witness1: string;
  witness2: string;
  comptrollerWitness: string;
  elaborate: string;
  numRegister: string;
  identifier: any;
  universalFolio: any;
  numeraryFolio: any;
  numTransfer: any;
  numRequest: any;
  indFulfilled: any;
  affair: any;
  receiveBy: any;
  destructionMethod: any;
  approvedXAdmon: any;
  approvalDateXAdmon: any;
  approvalUserXAdmon: any;
  idTypeProceedings: string;
}

export function trackerGoodToDetailProceeding(
  item: ITrackedGood,
  idProceeding: string
): IDetailProceedingsDeliveryReception {
  return {
    numberProceedings: +idProceeding,
    numberGood: +item.goodNumber,
    amount: 1,
    received: 'S',
    approvedXAdmon: 'S',
    approvedDateXAdmon: firstFormatDate(new Date()),
    approvedUserXAdmon: '',
    dateIndicatesUserApproval: firstFormatDate(new Date()),
    numberRegister: 0,
    reviewIndft: 0,
    correctIndft: 0,
    idftUser: '',
    idftDate: new Date(),
    numDelegationIndft: 0,
    yearIndft: 0,
    monthIndft: 0,
    idftDateHc: new Date(),
    packageNumber: 0,
    exchangeValue: 0,
  };
}

export function deliveryReceptionToInfo(
  item: IProceedingDeliveryReception
): IProceedingInfo {
  return {
    id: +item.id,
    numFile: item.numFile,
    cveActa: item.keysProceedings,
    tipoActa: item.typeProceedings,
    labelActa: item.label,
    receiptKey: item.receiptKey,
    statusActa: item.statusProceedings,
    address: item.address,
    observations: item.observations,
    numDelegation1: item.numDelegation1,
    numDelegation1Description: item.numDelegation_1
      ? item.numDelegation_1.description
      : '',
    numDelegation2: item.numDelegation2,
    numDelegation2Description: item.numDelegation_2
      ? item.numDelegation_2.description
      : '',
    elaborationDate: formatForIsoDate(item.elaborationDate),
    closeDate: formatForIsoDate(item.closeDate),
    datePhysicalReception: formatForIsoDate(item.datePhysicalReception),
    maxDate: formatForIsoDate(item.maxDate),
    dateElaborationReceipt: formatForIsoDate(item.dateElaborationReceipt),
    dateCaptureHc: formatForIsoDate(item.dateCaptureHc),
    dateDeliveryGood: formatForIsoDate(item.dateDeliveryGood),
    dateCloseHc: formatForIsoDate(item.dateCloseHc),
    captureDate: formatForIsoDate(item.captureDate),
    dateMaxHc: formatForIsoDate(item.dateMaxHc),
    witness1: item.witness1,
    witness2: item.witness2,
    comptrollerWitness: item.comptrollerWitness,
    elaborate: item.elaborate,
    numRegister: item.numRegister,
    identifier: item.identifier,
    universalFolio: item.universalFolio,
    numeraryFolio: item.numeraryFolio,
    numTransfer: item.numTransfer,
    numRequest: item.numRequest,
    indFulfilled: item.indFulfilled,
    affair: item.affair,
    receiveBy: item.receiveBy,
    destructionMethod: item.destructionMethod,
    approvedXAdmon: item.approvedXAdmon,
    approvalDateXAdmon: item.approvalDateXAdmon,
    approvalUserXAdmon: item.approvalUserXAdmon,
    idTypeProceedings: item.idTypeProceedings,
  };
}
