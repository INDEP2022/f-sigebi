export interface IDetailProceedingsDeliveryReception {
  numberProceedings: number;
  numberGood: number;
  amount: number;
  received: any;
  approvedXAdmon: any;
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
  warehouse?: any;
  vault?: any;
  createdLocal?: boolean;
  description?: string;
  status?: string;
}
