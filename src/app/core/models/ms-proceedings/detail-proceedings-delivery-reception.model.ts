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

export interface IDetailProceedings {
  numberProceedings: string;
  numberGood: string;
  reviewIndft: string;
  correctIndft: string;
  idftDate?: Date;
  idftUser?: string;
  numDelegationIndft?: number;
}

export interface IDeleteDetailProceeding {
  numberGood: string | number;
  numberProceedings: string | number;
}

export interface IDetailWithIndEdo {
  no_acta: number;
  vIndEdoFisicod?: boolean;
  vNoColumna?: number;
  page?: number;
  perPage?: number;
}
