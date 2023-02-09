import { IDetailGoods } from './detail-goods.model';

export interface IDetailProceedingsDevolution {
  numGoodId: IDetailGoods;
  numGoodProceedingsId: number;
  numDetailId: number;
  refundAmount: number;
  approvedXAdmon: string;
  approvalDateXAdmon: Date;
  approvalUserXAdmon: string;
  dateIndicateUserApproval: Date;
  numberRegister: number;
  amountReturned: number;
  valChange: number;
  good: IDetailGoods[];
}
