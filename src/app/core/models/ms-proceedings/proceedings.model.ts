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
  idNoWorker1?: string;
  nameWorker2?: string;
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
  nameWitness2?: string;
  electronicSignatureWorker1?: boolean;
  electronicSignatureWorker2?: boolean;
  electronicSignatureUvfv?: boolean;
  electronicSignatureOic?: boolean;
  electronicSignatureWitness1?: boolean;
  electronicSignatureWitness2?: boolean;
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
  proceeding?: string;
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
