import { IGood } from '../ms-good/good';

export interface IDetailProceedingsDeliveryReception {
  numberProceedings?: number | string;
  numberGood?: number;
  amount?: number;
  received?: string;
  approvedXAdmon?: string;
  approvedDateXAdmon?: Date;
  approvedUserXAdmon?: string;
  dateIndicatesUserApproval?: Date;
  numberRegister?: number;
  reviewIndft?: number;
  correctIndft?: number;
  idftUser?: string;
  idftDate?: Date;
  good?: IGood;
  numDelegationIndft?: number;
  yearIndft?: number;
  monthIndft?: number;
  idftDateHc?: Date;
  packageNumber?: number;
  exchangeValue?: number;
}

export interface IDeleteDetailProceeding {
  numGoodId: string | number;
  numGoodProceedingsId: string | number;
  numDetailId: string | number;
}
