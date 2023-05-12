export interface IDetailProceedingsDeliveryReception {
  numberProceedings: number;
  numberGood: number;
  amount: number;
  received: string;
  approvedXAdmon: string;
  approvedDateXAdmon: Date | string;
  approvedUserXAdmon: string;
  dateIndicatesUserApproval: Date | string;
  numberRegister: number;
  reviewIndft?: number;
  correctIndft?: number;
  idftUser?: string;
  idftDate?: Date;
  numDelegationIndft?: number;
  yearIndft?: number;
  monthIndft?: number;
  idftDateHc?: Date;
  packageNumber?: number;
  exchangeValue: number;
  good?: any;
  fileId?: string;
  associatedExpId?: string;
}
