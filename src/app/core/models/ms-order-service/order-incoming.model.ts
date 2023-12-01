export interface IOrderIncoming {
  id: number;
  orderServiceType: number;
  orderIncomeId: number;
  version: number;
  compliments: number;
  missing: number;
  porcbirthday: number;
  porcmissing: number;
  totalamount: number;
  porcdeductive: number;
  delaySampling: number;
  porcGriefConventional: number;
  porcGriefCheck: number;
  totaldeductive: number;
  deductiveType: number;
  periodSampling: string;
  samplingOrderId: number;
  InvoiceOrder: string;
  transfereeId: number;
  descriptionGood: string;
  nbOrigin: string;
}
