export interface ISaeNsbGoodsNeH {
  procneId: string | number;
  recordDate: string;
  procStatus: number;
  beneficiary: string;
  rfcBeneficiary: string;
  reference: string | number;
  referenceDate: string;
  amount: string | number;
  payDate: string;
  BankKey: string;
  account: string;
  branch: string;
  payCode: string;
  payType: string;
  payResult: string;
  area: string;
  document: string;
  aresponsable: string;
  concept: string;
  exhibit: string;
  date: string;
  tipope: string;
  payForm: string;
  usauthorize: string;
  numovto: string | number;
  incomeid: string;
  oiFolio: string;
  oiDate: string;
  oiStatusId: string;
  satTypeId: string;
  motionNumber: string | number;
  flowgo: string;
  originId: string;
  recordNumber: string | number;
}

export interface BlkControl {
  rgTipoQuery: string;
  statusProc: number;
}

export interface ISaeNsbGoodsNeD {
  procneId: string | number;
  consecutive: string;
  mandate: string;
  income: string;
  amount: string | number;
  vat: string;
  amountIfyou: string | number;
  indtype: string;
  description: string;
  aresponsable: string;
  porcvat: string;
  siabGoods: string;
  recordNumber: string;
}

export interface ISaeNsbGoodsNeB {
  procneId: string | number;
  goodNumber: string;
  inventoryNumber: string;
  transactiongo: string;
  formerStatus: string;
  boardId: string | number;
  processId: string | number;
  amount: string | number;
  amountImport: string | number;
  vat: string;
  sivaAmount: string | number;
  goodparkNumber: string;
  numberGoodnumber: string;
  transfereeNumber: string;
  mandate: string;
  affectedTypeId: string;
  flowgo: string;
  recordNumber: string;
}
