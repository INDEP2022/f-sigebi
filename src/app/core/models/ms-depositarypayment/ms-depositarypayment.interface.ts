export interface IRefPayDepositary {
  payId: number;
  reference: string;
  movementNumber: number;
  date: Date;
  amount: number;
  cve_bank: string;
  code: number;
  noGood: number;
  validSystem: string;
  description: string;
  type: string;
  entryorderid: number;
  result: string;
  sucursal: string;
  reconciled: string;
  registrationDate: Date;
  referenceori: string;
  oiDate: Date;
  appliedto: string;
  client_id: string;
  registerNumber: number;
  sent_oi: string;
  invoice_oi: string;
  indicator: number;
  system_val_date: Date;
}

export interface IPaymentsGensDepositary {
  payIdGens: number;
  payId: number;
  noGoods: number;
  amount: number;
  reference: string;
  not_transferring: number;
  iva: number;
  ivaAmount: number;
  payment: number;
  actPay: number;
  deduxcent: number;
  deduvalue: number;
  status: string;
  appointmentNumber: number;
  processDate: Date;
  coveredPayId: number;
  impWithoutIva: number;
  coveredPayment: number;
  payObserv: string;
  deduObserv: string;
  incometype: string;
  recordNumber: number;
}

export interface ISendSirSaeBody {
  process: number;
  appointment: number;
  idorderincome: string;
  validSystem: string;
  shipmentOi: string;
  peopleNumber: number;
  idPay: number;
}

export interface IResponseSirsaeFunction {
  lstError: string;
  lstLot: string;
}

export interface ITotalIvaPaymentsGens {
  goodNumber: number;
  payId: number;
}

export interface ITotalIvaPaymentsGensResponse {
  totaliva: string;
  totalwiva: string;
  totalpay: string;
}

export interface ITotalAmountRefPayments {
  goodNumber: number;
  amount: number; // Se toma este valor como mayor que para la consulta. Por ejemplo si se pasa 10 todos los montos mayores a 10
}

export interface ITotalAmountRefPaymentsResponse {
  totalamount: string;
}
