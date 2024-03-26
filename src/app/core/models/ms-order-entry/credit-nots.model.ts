export interface ICreditNote {
  version: string;
  description: string;
  amountPay: number;
  indApplied: string;
  amountDeduction: number;
  invoiceDate: string;
  contractNumber: string;
  orderPayId: number;
  invoiceNumber: number;
  id: number;
  transfereeId: number;
  samplingId: number;
  porcDeduction: number;
  delegationRegionalId: number;
  reportIndicatorId: number;
  orderEntryId: number;
  daysDelayNumber: number;
  orderServiceId: number;
  programmingDeliveryId: number;
}
