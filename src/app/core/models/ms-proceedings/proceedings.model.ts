import { IDelegationNumber } from './delegation-number.model';
import { IFileNumber } from './file-number.model';
import { IIdentifier } from './identifier.model';
import { ITransferNumber } from './transfer-number.model';

export interface IProceedings {
  id: number;
  proceedingsType: string;
  proceedingsCve: string;
  elaborationDate: Date;
  proceedingStatus: string;
  elaborated: string;
  userDestruction: string;
  methodDestruction: string;
  authorityOrder: string;
  beneficiaryOwner: string;
  userAuthorizesDonation: string;
  witnessOne: string;
  witnessTwo: string;
  auditor: string;
  receiptElaborationDate: Date;
  goodsDeliveryDate: Date;
  observations: string;
  fileNumber: IFileNumber;
  numRegister: number;
  delegationNumberOne: number;
  delegationNumberTwo: number;
  label: string;
  universalFolio: number;
  numeraryFolio: number;
  receiptCve: string;
  transferNumber: ITransferNumber;
  proceedingsTypeId: string;
  identifier: IIdentifier;
  proceeding: string;
  closingDate: Date;
  hcClosingDate: Date;
  delegationNumber: IDelegationNumber;
}
