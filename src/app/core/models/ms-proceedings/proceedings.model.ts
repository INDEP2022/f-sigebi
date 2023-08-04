import { IDelegationNumber } from './delegation-number.model';
import { IFileNumber } from './file-number.model';
import { IIdentifier } from './identifier.model';
import { ITransferNumber } from './transfer-number.model';

export interface IProceedings {
  id?: number;
  actId?: number;
  programmingId?: number;
  idPrograming?: number;
  minutesId?: number;
  proceedingsType?: string;
  proceedingsCve?: string;
  folioProceedings?: string;
  nameWorker1?: string;
  positionWorker1?: string;
  id_content?: string;
  idCatWorker1?: string;
  residentialWorker1?: string;
  idExpWorker1?: string;
  emailWorker1?: string;
  emailWorker2?: string;
  idNoWorker1?: string;
  nameWorker2?: string;
  emailWitness1?: string;
  emailWitness2?: string;
  idCatWorkerOic?: string;
  idNoWorkerOic?: string;
  positionWorker2?: string;
  positionWorkerUvfv?: string;
  positionWorkerOic?: string;
  statusProceeedings?: string;
  idCatWorker2?: string;
  idCatWitness1?: string;
  observationProceedings?: string;
  idCatWitness2?: string;
  idNoWitness1?: string;
  idNoWitness2?: string;
  idNoWorker2?: string;
  nameWorkerOic?: string;
  nameWorkerUvfv?: string;
  nameWitness1?: string;
  idExpWorker2?: string;
  nameWitness2?: string;
  electronicSignatureWorker1?: number;
  electronicSignatureWorker2?: number;
  electronicSignatureUvfv?: number;
  electronicSignatureOic?: number;
  electronicSignatureWitness1?: number;
  electronicSignatureWitness2?: number;
  elaborationDate?: Date;
  proceedingStatus?: string;
  elaborated?: string;
  userDestruction?: string;
  methodDestruction?: string;
  authorityOrder?: string;
  beneficiaryOwner?: string;
  userAuthorizesDonation?: string;
  witnessOne?: string;
  witnessTwo?: string;
  auditor?: string;
  receiptElaborationDate?: Date;
  goodsDeliveryDate?: Date;
  observations?: string;
  fileNumber?: IFileNumber;
  numRegister?: number;
  delegationNumberOne?: number;
  delegationNumberTwo?: number;
  label?: string;
  universalFolio?: number;
  numeraryFolio?: number;
  receiptCve?: string;
  transferNumber?: ITransferNumber;
  proceedingsTypeId?: string;
  identifier?: IIdentifier;
  idExpWorkerOic?: string;
  emailOic?: string;
  nameWorker4?: string;
  positionWorker4?: string;
  emailUvfv?: string;
  otherFacts?: string;
  evet?: string;
  startTime?: string;
  bases?: string;
  celebrates?: string;
  proceeding?: string;
  nameWorker3?: string;
  closingDate?: Date;
  hcClosingDate?: Date;
  delegationNumber?: IDelegationNumber;
}

export interface IUpdateActasEntregaRecepcion {
  universalFolio: string;
  userToolbar: string;
}

export interface IUpdateActasEntregaRecepcionDelegation {
  minutesNumber: [];
  delegation2Number: [];
}

export interface IDetailProceedingsDevollution {
  numberProceedings: string | number;
  numberGood: string | number;
  amount: string | number;
  received?: string;
  approvedXAdmon?: string;
  approvedDateXAdmon?: string;
  approvedUserXAdmon?: string;
  dateIndicatesUserApproval?: string;
  numberRegister?: string;
  reviewIndft?: string;
  correctIndft?: string;
  idftUser?: string;
  idftDate?: string;
  numDelegationIndft?: string;
  yearIndft?: string;
  monthIndft?: string;
  idftDateHc?: string;
  packageNumber?: string;
  exchangeValue?: string;
}

export interface IDetailProceedingsDevollutionDelete {
  numberGood: string | number;
  numberProceedings: string | number;
}
